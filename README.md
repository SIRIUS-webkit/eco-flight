# EcoFly 🌍✈️

Ecofly focuses on carbon emission tracking and offsetting by flight users. The project includes several components: a flight form where users input flight details to calculate the carbon emissions generated; a donation system that accepts cryptocurrency and rewards users with eco tokens; a carbon offset projects form that allows green initiatives to provide their information and join our platform; and a RAG chatbot that guides users by suggesting suitable carbon offset projects based on their preferences and encouraging donations. 

------

## 🚀 Features

- **Flight Carbon Emission Tracking**: Calculate the carbon emissions generated by flights using advanced algorithms.
- **Donation System**: Donate to verified green projects using cryptocurrency and receive eco-tokens as rewards.
- **Carbon Offset Projects**: Explore and support projects focused on reforestation, renewable energy, and other sustainable initiatives.
- **Smart Contracts**: Utilize Ethereum-based contracts for emission tracking and eco-token issuance.
- **Web3 Integration**: Enable seamless interaction with blockchain wallets for secure and transparent transactions.
- **Interactive Chatbot**: AI-powered chatbot to guide users through emission calculations, offset suggestions, and donations.

### Steps

1. **Clone the Repository**:

   ```
   git clone https://github.com/SIRIUS-webkit/eco-flight.git
   cd eco-flight
   ```

2. **Install Frontend Dependencies**:

   ```
   
   ```

3. **Run Frontend**:

   

4. **Install Chatbot Dependencies**:

   ```
   cd chat-bot
   python -m venv .venv
   pip install -r requirements.txt
   ```

5. **Run Chatbot**:

   ```
   python manage.py runserver --noreload
   ```



## 📂 Folder Structure

```
eco-flight/
│
├── contract/               # Solidity smart contracts
│   ├── CarbonEmission.sol   # Main smart contract for emissions
│   └── EcoToken.sol         # ERC-20 token contract
│
├── client-site/             # React.js-based user interface
│   ├── src/                 # Source code
│   ├── public/              # Public assets
│   └── package.json         # Frontend dependencies
│
├── chat-bot/                 # Python-based backend
│   ├── chat                 # Django main application
         ├──rag.py
│   ├── requirements.txt     # Chatbot dependencies
│   └── mychat       
│   └── manage.py
└── README.md           
```



## 🛠️ Technologies Used

- **Frontend**: Next.js, Tailwind CSS, Dasiy UI
- **Backend**: Node.js, Python Django
- **Blockchain**: Solidity, Ethereum (tested on Sepolia network), MetaMask , Web3Auth, Push Protocol
- **Smart Contracts**: Chainlink Oracle Integration for emission data, ERC-20 EcoTokens
- **AI**: Retrieval-Augmented Generation (RAG) , LLM-based chatbot for user assistance



## 👥 Team

- La Min Ko Ko
- Kyu Kyu Swe
- Hnin Ei Khaing
- Eaint Lay Hmone

