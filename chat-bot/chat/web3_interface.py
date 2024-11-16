from web3 import Web3
import json
import os
from dotenv import load_dotenv

# Load environment variables from the .env file (if present)
load_dotenv()

# Connect to the Sepolia network using Infura
infura_url = f"https://sepolia.infura.io/v3/{os.getenv('NEXT_PUBLIC_INFURA_API_KEY')}"
web3 = Web3(Web3.HTTPProvider(infura_url))
with open("contract/artifacts/contracts/EcoToken.sol/EcoToken.json") as f:
    eco_token_abi = json.load(f)["abi"]

with open("contract/artifacts/contracts/CarbonEmission.sol/CarbonEmission.json") as f:
    carbon_emission_abi = json.load(f)["abi"]

with open("contract/artifacts/contracts/GreenProject.sol/GreenProject.json") as f:
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

def getDonationProjects(user_address):
    projects_lst = green_project_contract.functions.getProjects().call()
    print("Projects list", projects_lst)
    formatted_string = "Here are the donation projects list:\n"
    for i, project in enumerate(projects_lst[0], start=1):
        project_name = project[0] if isinstance(project[0], str) else project[0][0]
        formatted_string += f" {i}. {project_name}\n"
    return formatted_string


def getUserBalance(user_address):
    """Check the balance of the given wallet address"""
    print(web3.eth.get_balance(user_address))
    return f"Your balance is {round(web3.eth.get_balance(user_address))*(10 ** (-18))} ETH"

#print(getEcotokenBalance("0x05C24Bcc77485bA11a32c17FB3c887D3a2F00CFb"))

def get_total_carbon_emission(user_address):
    """Check the total amount of carbon emission"""
    print("It is calling total carbon emission")
    # Call the getUserFlights function
    try:
        flights = carbon_emission_contract.functions.getUserFlights(user_address).call()
        print("Fight are", flights)
        # Sum up the emissions
        total_emission = sum(flight[4] for flight in flights)  # Assuming emission is the 5th field in the tuple
        print("Total emission is", round(total_emission/100,2))
        return f"Total emission is {round(total_emission/100,2)}"
    except Exception as e:
        print(f"Error fetching user flights: {e}")
        return None


def get_eco_token_balance(user_address):
    balance = eco_token_contract.functions.balanceOf(user_address).call()
    return f"You currently hold {round(balance*(10 ** (-18)))} EcoTokens."""
