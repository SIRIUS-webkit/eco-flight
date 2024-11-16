from web3 import Web3
import json
import os
from dotenv import load_dotenv

# Load environment variables from the .env file (if present)
load_dotenv()

# Connect to the Sepolia network using Infura
infura_url = f"https://sepolia.infura.io/v3/{os.getenv('NEXT_PUBLIC_INFURA_API_KEY')}"
web3 = Web3(Web3.HTTPProvider(infura_url))
with open("D:/tokenized-crowdfunding-platform/smart-contract/artifacts/contracts/EcoToken.sol/EcoToken.json") as f:
    eco_token_abi = json.load(f)["abi"]

with open("D:/tokenized-crowdfunding-platform/smart-contract/artifacts/contracts/CarbonEmission.sol/CarbonEmission.json") as f:
    carbon_emission_abi = json.load(f)["abi"]

with open("D:/tokenized-crowdfunding-platform/smart-contract/artifacts/contracts/GreenProject.sol/GreenProject.json") as f:
    green_project_abi = json.load(f)["abi"]

# Set up contract addresses
eco_token_address = os.getenv("NEXT_PUBLIC_ECOTOKEN_ADDRESS")
carbon_emission_address = os.getenv("NEXT_PUBLIC_CARBONEMISSION_ADDRESS")
green_project_address = os.getenv("NEXT_PUBLIC_GREENPROJECT_ADDRESS")

# Create contract instances
eco_token_contract = web3.eth.contract(address=eco_token_address, abi=eco_token_abi)
carbon_emission_contract = web3.eth.contract(address=carbon_emission_address, abi=carbon_emission_abi)
green_project_contract = web3.eth.contract(address=green_project_address, abi=green_project_abi)


def getUserFlights(user_address):
    try:
        user_flights = carbon_emission_contract.functions.getUserFlights(user_address).call()
        print("Flight Emission Data:", user_flights)
        for flight in user_flights:
           print("Distance", flight[0])
           print("Number of Passengers",flight[1])
    except Exception as e:
        print(f"Error retrieving flight emissions: {e}")


#getUserFlights("0x05C24Bcc77485bA11a32c17FB3c887D3a2F00CFb")

def getDonationProjects():
    projects_lst = green_project_contract.functions.getProjects().call()
    print("Projects list", projects_lst)
    return projects_lst

projects = getDonationProjects()
for p in projects:
    print("Projects :", p[0][0])
    print("Description :", p[0][1])


def getUserBalance(user_address="0x05C24Bcc77485bA11a32c17FB3c887D3a2F00CFb"):
    """Check the balance of the given wallet address"""
    print(web3.eth.get_balance(user_address))
    return f"Your balance is {web3.eth.get_balance(user_address)}"


def getEcotokenBalance(user_address):
    ecotokenAmount = eco_token_contract.functions.balanceOf(user_address).call()
    return ecotokenAmount

#print(getEcotokenBalance("0x05C24Bcc77485bA11a32c17FB3c887D3a2F00CFb"))

def get_total_carbon_emission(user_address="0x05C24Bcc77485bA11a32c17FB3c887D3a2F00CFb"):
    print("It is calling total carbon emission")
    # Call the getUserFlights function
    try:
        flights = carbon_emission_contract.functions.getUserFlights(user_address).call()
        
        # Sum up the emissions
        total_emission = sum(flight[4] for flight in flights)  # Assuming emission is the 5th field in the tuple

        return total_emission
    except Exception as e:
        print(f"Error fetching user flights: {e}")
        return None


def donate_to_project(project_id, donation_amount, sender_address, private_key):
    """
    Donate to a project on the GreenProject smart contract.

    :param project_id: The ID of the project to donate to.
    :param donation_amount: The donation amount in Wei.
    :param sender_address: The Ethereum address of the donor.
    :param private_key: The private key of the donor (for signing the transaction).
    :return: Transaction receipt or error message.
    """

    # Prepare the transaction
    try:
        tx = green_project_contract.functions.donateToProject(project_id).build_transaction({
            'from': sender_address,
            'value': donation_amount,
            'gas': 300000,  # Estimate the gas limit
            'gasPrice': web3.to_wei('5', 'gwei'),
            'nonce': web3.eth.get_transaction_count(sender_address),
        })

        # Sign the transaction
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)

        # Send the transaction
        tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)

        # Wait for transaction receipt
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

        return receipt
    except Exception as e:
        print(f"Error while donating to project: {e}")
        return None
    

"""def get_carbon_emission(user_address):
    # Call the contract function to retrieve carbon data
    emission_data = carbon_emission_contract.functions.getUserFlights(user_address).call()
    return f"Your current carbon emission is {emission_data} kg of CO₂."




def get_eco_token_balance(user_address):
    balance = eco_token_contract.functions.balanceOf(user_address).call()
    return f"You currently hold {balance} EcoTokens."""
