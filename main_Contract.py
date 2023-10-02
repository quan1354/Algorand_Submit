from beaker import *
from pyteal import *
from beaker.lib.storage import BoxMapping

class CustomerItem(abi.NamedTuple):
    Address: abi.Field[abi.Address]
    # Name: abi.Field[abi.String]
    Points: abi.Field[abi.Uint64]
    Subcribed: abi.Field[abi.Bool] 

class RedeemItem(abi.NamedTuple):
    Gift: abi.Field[abi.String]
    Level: abi.Field[abi.Uint64]

class mainStates():
    CustomerItem_Count = GlobalStateValue(stack_type=TealType.uint64, default=Int(0))
    RedeemItem_Count = GlobalStateValue(stack_type=TealType.uint64, default=Int(0))
    Customers = BoxMapping(abi.Address, CustomerItem)
    Redeems = BoxMapping(abi.String, RedeemItem)

app = Application("Chain Chain Application", state=mainStates()).apply(
    unconditional_create_approval, initialize_global_state=True)

'''
    Redeem Item
'''
@app.external
def addRedeem(gift_name: abi.String, level: abi.Uint64)-> Expr:
    redeem_item_tuple = RedeemItem()
    return Seq(
        redeem_item_tuple.set(gift_name, level),
        app.state.Redeems[gift_name.get()].set(redeem_item_tuple),
        app.state.RedeemItem_Count.increment()
    )

@app.external
def getRedeem(gift_name: abi.String, *, output:RedeemItem) -> Expr:
    return app.state.Redeems[gift_name.get()].store_into(output)

# @app.external
# def setRedeem(gift_name: abi.String, field: abi.String, value: 'Any', output: RedeemItem) -> Expr:
#     existing_redeem = RedeemItem()
#     updated_redeem = RedeemItem()

#     return Seq(
#         Cond(
#             [field == "Gift", updated_redeem.Gift.set(value) if isinstance(value, abi.String) else Return(Int(0))],
#             [field == "Level", updated_redeem.Level.set(value) if isinstance(value, abi.Uint64) else Return(Int(0))],
#             # Add more conditions as needed for other fields
#         ),
#         existing_redeem.decode(app.state.Redeems[gift_name.get()].get()),
#         app.state.Redeems[gift_name.get()].set(updated_redeem),  # Update the RedeemItem in state
#         app.state.Redeems[gift_name.get()].store_into(output)  # Store the updated RedeemItem into the output parameter
#     )

@app.external
def deleteRedeem(gift_name: abi.String) -> Expr:
    return Pop(app.state.Redeems[gift_name.get()].delete())

'''
    Customer
'''
@app.external
def addCustomer(addr: abi.Address, 
                # name:abi.String, 
                point:abi.Uint64, 
                isSubcribe:abi.Bool
                )-> Expr:
    customer_item_tuple = CustomerItem()
    return Seq(
        customer_item_tuple.set(addr, 
                                # name, 
                                point, 
                                isSubcribe),
        app.state.Customers[addr.get()].set(customer_item_tuple),
        app.state.CustomerItem_Count.increment()
    )

@app.external
def getCustomer(addr: abi.Address, *, output:CustomerItem) -> Expr:
    return app.state.Customers[addr.get()].store_into(output)

# @app.external
# def getCustomerStorageIndex(*, output:abi.Uint64) -> Expr:
#     return output.set(app.state.CustomerItem_Count)


@app.external
def updateCustomerPoints(address: abi.Address, new_points: abi.Uint64, *, output: CustomerItem) -> Expr:
    existing_customer = CustomerItem()
    subscribed = abi.Bool()
    
    return Seq(
        existing_customer.decode(app.state.Customers[address.get()].get()),
        subscribed.set(Int(1)),
        existing_customer.set(
            address,
            new_points,
            subscribed
        ),
        app.state.Customers[address.get()].set(existing_customer),
        app.state.Customers[address.get()].store_into(output), 
    )