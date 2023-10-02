from main_Contract import *
from beaker import localnet, client
from beaker.consts import algo
from algosdk import encoding
from algokit_utils.logic_error import LogicError
from algosdk import kmd, mnemonic

import json
from algosdk.v2client import algod
from algosdk import transaction

from flask import Flask
from flask_restful import Api
from flask_cors import CORS

flask_app = Flask(__name__)
flask_app.secret_key = 'super secret key'
flask_app.config['SESSION_TYPE'] = 'filesystem'
api = Api(flask_app)
CORS(flask_app)

app.build().export("./artifacts")

accounts = localnet.kmd.get_accounts()
sender = accounts[0]

app_client = client.ApplicationClient(
    client=localnet.get_algod_client(),
    app=app,
    sender=sender.address,
    signer=sender.signer,
) 
algod_address = "http://localhost:4001"
algod_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
algod_client = algod.AlgodClient(algod_token=algod_token, algod_address=algod_address)

KMD_ADDRESS = "http://localhost:4002"
KMD_TOKEN = "a" * 64
KMD_WALLET_NAME = "unencrypted-default-wallet"
KMD_WALLET_PASSWORD = ""

quan_mnemonic = "song track easy diesel curious basic peace actual wild arm clump pole wrong method rifle trial patrol olive abandon survey negative bird patient about laugh"
kmd_client = kmd.KMDClient(kmd_token=KMD_TOKEN, kmd_address=KMD_ADDRESS)

app_id, addr, txid = app_client.create()
print(f"""Deployed app in txid {txid} App ID: {app_id}App Address: {addr}""")

app_client.fund(1 * algo)
"""
    Redeem API
"""
# Add Redeem item into shop
@flask_app.route('/add_redeem/<gift_name>/<int:level>')
def add_redeem(gift_name, level):
    app_client.call(
        addRedeem, 
        gift_name = gift_name,
        level = level,
        boxes=[(app_client.app_id, gift_name)]
    )
    print(app_client.get_global_state())
    return { "gift_name": gift_name, "level": level }
    
# Read Redeem by gift name into shop 
@flask_app.route('/get_redeem/<gift_name>')
def get_redeem(gift_name):
    value = app_client.call(
        getRedeem, 
        gift_name=gift_name, 
        boxes=[(app_client.app_id, gift_name)]
    )
    print(value.return_value)
    return {"data": value.return_value}

#Update Redeem
# value = app_client.call(
#     setRedeem, item_name="2 Free Drinks",field = "Gift", value="20% Discount", boxes=[(app_client.app_id, "2 Free Drinks")]
# )
# print(f"updated: {value.return_value}")

#Delete Redeem by gift name into shop
@flask_app.route('/delete_redeem/<gift_name>')
def delete_redeem(gift_name):
    app_client.call(deleteRedeem, gift_name = gift_name, boxes=[(app_client.app_id, gift_name)])
    try:
        value = app_client.call(
            getRedeem, gift_name=gift_name, boxes=[(app_client.app_id, gift_name)]
        )
        print(value.return_value)
    except LogicError as e:
        print(f"The {gift_name} has been deleted")
    
    return { "data": gift_name }

"""
    Customer API
"""
# Add Customer
@flask_app.route('/add_customer/<point>/<isSubcribe>')
def add_customer(point, isSubcribe):
    globalState = app_client.get_global_state()
    # storageIndex = app_client.call(getCustomerStorageIndex)
    storageIndex = int(globalState["CustomerItem_Count"])
    
    if storageIndex < len(accounts):
        app_client.call(
                addCustomer, 
                addr = accounts[storageIndex].address,
                point = point,
                isSubcribe = isSubcribe,
                boxes=[(app_client.app_id, encoding.decode_address(accounts[storageIndex].address))]
            )
        print(app_client.get_global_state())
    else:
        print("Your wallet accounts was filled with customer detail in full, please try on import more account into wallet")

# Get Customer By Address
@flask_app.route('/get_customer/<address>')
def get_customer(address):
    value = app_client.call(
        getCustomer, 
        addr= address, 
        boxes=[(app_client.app_id, encoding.decode_address(address))]
    )
    print(value.return_value)
    return {"data": value.return_value}

# Update Customer Points
@flask_app.route("/update_customer_point/<address>/<int:point>")
def update_customer_point(address, point):
    # existing_customer = get_customer(address)
    # print(type(existing_customer))
    value = app_client.call(
        updateCustomerPoints, 
        address = address, 
        new_points = point, 
        boxes=[(app_client.app_id, encoding.decode_address(address))]
    )
    print(value.return_value)
    return {"data": value.return_value}

'''
    Account API
'''
@flask_app.route("/get_wallet_id")
def get_wallet_id_from_name(name: str):
    wallets = kmd_client.list_wallets()
    wallet_id = None
    for w in wallets:
        if w["name"] == name:
            wallet_id = w["id"]
            break

    if wallet_id is None:
        raise Exception(f"No wallet with name {name} found")

    return wallet_id

@flask_app.route("/import_account/<passphase>")
def kmd_import_Accout(passphase):
    wallet_id = get_wallet_id_from_name(KMD_WALLET_NAME)
    print(f"Waller ID:{wallet_id}")
    # Generate a new account client side
    # new_private_key, new_address = account.generate_account()
    memonic = mnemonic.from_private_key(passphase)
    private_key = mnemonic.to_private_key(passphase)

    # check address exist accounts collection, if not add it 
    for acc in accounts:
        if acc.private_key == private_key:
            print(f"Account with address already exists in the wallet.")
            return
        
    # Import the account to the wallet in KMD
    wallethandle = kmd_client.init_wallet_handle(wallet_id, KMD_WALLET_PASSWORD)
    importedaccount = kmd_client.import_key(wallethandle, private_key)
    print("Account successfully imported: ", importedaccount)

'''
    Asset API
'''
def print_created_asset(algodclient: algod.AlgodClient, addr: str, assetid: int):
    """Utility function used to print created asset for account and assetid"""

    account_info = algodclient.account_info(addr)
    idx = 0
    for my_account_info in account_info["created-assets"]:
        scrutinized_asset = account_info["created-assets"][idx]
        idx = idx + 1
        if scrutinized_asset["index"] == assetid:
            print("Asset ID: {}".format(scrutinized_asset["index"]))
            print(json.dumps(my_account_info["params"], indent=4))
            break

def print_asset_holding(algodclient: algod.AlgodClient, addr: str, assetid: int):
    """Utility function used to print asset holding for account and assetid"""

    # note: if you have an indexer instance available it is easier to just use this
    # response = myindexer.accounts(asset_id = assetid)
    # then loop thru the accounts returned and match the account you are looking for
    account_info = algodclient.account_info(addr)
    idx = 0
    for my_account_info in account_info["assets"]:
        scrutinized_asset = account_info["assets"][idx]
        idx = idx + 1
        if scrutinized_asset["asset-id"] == assetid:
            print("Asset ID: {}".format(scrutinized_asset["asset-id"]))
            print(json.dumps(scrutinized_asset, indent=4))
            break

@flask_app.route("/create_account/<account>/<value>")
def createAsset(account, assetValue):
    # CREATE ASSET
    params = algod_client.suggested_params()
    txn = transaction.AssetConfigTxn(
        sender=account.address,
        sp=params,
        total= assetValue,
        default_frozen=False,
        unit_name="point",
        asset_name= "Loyal Points Token",
        manager=account.address,
        reserve=account.address,
        freeze=account.address,
        clawback=account.address,
        url="https://path/to/my/asset/details",
        decimals=0,
    )

    # Sign with secret key of creator
    stxn = txn.sign(account.private_key)

    # Send the transaction to the network and retrieve the txid.
    txid = algod_client.send_transaction(stxn)
    print("Asset Creation Transaction ID: {}".format(txid))

    # Wait for the transaction to be confirmed
    confirmed_txn = transaction.wait_for_confirmation(algod_client, txid, 4)
    print("TXID: ", txid)
    print("Result confirmed in round: {}".format(confirmed_txn["confirmed-round"]))
    try:
        # Pull account info for the creator
        # account_info = algod_client.account_info(accounts[1]['pk'])
        # get asset_id from tx
        # Get the new asset's information from the creator account
        ptx = algod_client.pending_transaction_info(txid)
        asset_id = ptx["asset-index"]
        print("===========================1==========================")
        print_created_asset(algod_client, account.address, asset_id)
        print_asset_holding(algod_client, account.address, asset_id)
        print("===========================1==========================")
    except Exception as e:
        print(e)
    return asset_id

@flask_app.route("/opt_in/<receiver>/<asset_id>")
def optIn(algod_client, receiver, asset_id):
    print("--------------------------------------------")
    print("Opt-in for sender's token......")
    params = algod_client.suggested_params()
    account_info = algod_client.account_info(receiver.address)
    holding = None
    idx = 0
    for my_account_info in account_info["assets"]:
        scrutinized_asset = account_info["assets"][idx]
        idx = idx + 1
        if scrutinized_asset["asset-id"] == asset_id:
            holding = True
            break

    
    if not holding:
        # Use the AssetTransferTxn class to transfer assets and opt-in
        txn = transaction.AssetTransferTxn(
            index=asset_id,
            sender=receiver.address, 
            sp=params, 
            receiver=receiver.address, 
            amt=0, 
        )
        stxn = txn.sign(receiver.private_key)
        txid = algod_client.send_transaction(stxn)
        print(txid)
        # Wait for the transaction to be confirmed
        confirmed_txn = transaction.wait_for_confirmation(algod_client, txid, 4)
        print("TXID: ", txid)
        print("Result confirmed in round: {}".format(confirmed_txn["confirmed-round"]))
        # Now check the asset holding for that account.
        # This should now show a holding with a balance of 0.
        print_asset_holding(algod_client, addr=receiver.address, assetid=asset_id)

@flask_app.route("/transfer_asset/<sender>/<receiver>/<asset_id>")
def transferAssets(algod_client, sender, receiver, asset_id):
    print("--------------------------------------------")
    print("Transfering sender's token to receiver......")
    params = algod_client.suggested_params()
    txn = transaction.AssetTransferTxn(
        sender=sender.address, 
        sp=params, 
        receiver=receiver.address, 
        amt=10, 
        index=asset_id
    )
    stxn = txn.sign(sender.private_key)
    txid = algod_client.send_transaction(stxn)
    print(txid)
    # Wait for the transaction to be confirmed
    confirmed_txn = transaction.wait_for_confirmation(algod_client, txid, 4)
    print("TXID: ", txid)
    print("Result confirmed in round: {}".format(confirmed_txn["confirmed-round"]))
    # The balance should now be 10.
    print_asset_holding(algod_client, receiver.address, asset_id)

@flask_app.route("/destroy_asset/<sender>/<asset_id>")
def destroyAsset(algod_client, sender, asset_id):
    print("--------------------------------------------")
    print("Destroying sender's token......")
    params = algod_client.suggested_params()
    # Asset destroy transaction
    txn = transaction.AssetConfigTxn(
        sender=sender.address, sp=params, index=asset_id, strict_empty_address_check=False
    )

    # Sign with secret key of creator
    stxn = txn.sign(sender.private_key)
    # Send the transaction to the network and retrieve the txid.
    txid = algod_client.send_transaction(stxn)
    print(txid)
    # Wait for the transaction to be confirmed
    confirmed_txn = transaction.wait_for_confirmation(algod_client, txid, 4)
    print("TXID: ", txid)
    print("Result confirmed in round: {}".format(confirmed_txn["confirmed-round"]))
    print("Alice's Token is destroyed.")

@flask_app.route("/closeout_account/<account>")
def closeout_account(algod_client, account):
    # build transaction
    print("--------------------------------------------")
    print("Closing out account......")
    params = algod_client.suggested_params()
    # comment out the next two (2) lines to use suggested fees
    #   params.flat_fee = True
    #   params.fee = 1000
    receiver = "HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA"
    closeout = "HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA"
    note = "closing out account".encode()

    # Fifth argument is a close_remainder_to parameter that creates a payment txn that sends all of the remaining funds to the specified address.
    # If you want to learn more, go to: https://developer.algorand.org/docs/reference/transactions/#payment-transaction
    unsigned_txn = transaction.PaymentTxn(account.address, params, receiver, 0, closeout, note)

    # sign transaction
    signed_txn = unsigned_txn.sign(account.private_key)
    txid = algod_client.send_transaction(signed_txn)
    print("Transaction Info:")
    print("Signed transaction with txID: {}".format(txid))

    # wait for confirmation
    try:
        confirmed_txn = transaction.wait_for_confirmation(algod_client, txid, 4)
        print("TXID: ", txid)
        print("Result confirmed in round: {}".format(confirmed_txn["confirmed-round"]))
    except Exception as err:
        print(err)
        return

    account_info = algod_client.account_info(account.address)
    print("Account balance: {} microAlgos".format(account_info.get("amount")) + "\n")
    print("Account Closed")

if __name__ == "__main__":
    # import Pera Wallet of account into using of wallet using passphase
    kmd_import_Accout(quan_mnemonic)
    accounts = localnet.kmd.get_accounts()
    # Load Default Customer details into box
    add_customer(100, True)
    add_customer(20, True)
    add_customer(20, True)
    add_customer(20, True)
    # Load Default Promotion for customer to redeem into box
    add_redeem("RM 5 Voucher", 20)
    add_redeem("RM 10 Voucher", 40)
    add_redeem("RM 20 Voucher", 60)
    '''
        Demo Scenario: 
        1) Quan account create 40 loyal points as asset
        2) Quan transfer to 10 points to William account, 
    '''
    asset_id = createAsset(accounts[0], 40)
    # Receiver have to optIn first, just allow accept asset from other account
    # optIn(algod_client, receiver=accounts[1], asset_id=asset_id)
    # transferAssets(algod_client, accounts[0], accounts[1], asset_id)
    # transferAssets(algod_client, accounts[1], accounts[0], asset_id)
    # destroyAsset(algod_client, accounts[0], asset_id)
    # closeout_account(algod_client, accounts[0])
    # closeout_account(algod_client, accounts[1])

    flask_app.debug = True
    flask_app.run(port=5002)