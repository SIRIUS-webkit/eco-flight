// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CarbonEmission is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    // Sepolia network configurations
    bytes32 private jobId;
    uint256 private fee;


    // Struct to store flight emission data
    struct FlightEmission {
        string departure;
        string destination;
        uint256 passengers;
        string tripType; // "direct" or "round"
        uint256 emission;
        uint256 timestamp;
        bool fulfilled;
    }

    // Mapping to store flight emissions for each user
    mapping(address => FlightEmission[]) public userFlights;
    mapping(bytes32 => address) private requestToUser;
    mapping(bytes32 => uint256) private requestToFlightIndex;

    // Events
    event EmissionRequested(
        bytes32 indexed requestId,
        string departure,
        string destination,
        uint256 passengers,
        string tripType
    );
    event EmissionReceived(
        bytes32 indexed requestId,
        uint256 emission
    );

    constructor() ConfirmedOwner(msg.sender) {
        _setChainlinkToken(0x779877A7B0D9E8603169DdbD7836e478b4624789);
        _setChainlinkOracle(0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD);
        jobId = "ca98366cc7314957b8c012c72f05aeeb";
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }

    function requestEmissionData(
        string memory _departure,
        string memory _destination,
        uint256 _passengers,
        uint256 _emissionRate,
        string memory _tripType) public returns (bytes32 requestId) {
        
        // Create the API request
        Chainlink.Request memory req = _buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        // Build the API URL with query parameters
        string memory url = string(
            abi.encodePacked(
                "https://carbon-emission-nine.vercel.app/api/calculate-emission?departure=",
                _departure,
                "&destination=",
                _destination,
                "&passengers=",
                Strings.toString(_passengers),
                "&tripType=",
                _tripType
            )
        );

        // Set the URL and path for the emission data
        req._add("get", url);
        req._add("path", "data,emission"); // Path in JSON response

        // Store flight data
        FlightEmission memory newFlight = FlightEmission({
            departure: _departure,
            destination: _destination,
            passengers: _passengers,
            tripType: _tripType,
            emission: _emissionRate,
            timestamp: block.timestamp,
            fulfilled: false
        });

        userFlights[msg.sender].push(newFlight);
        
        // Send the request
        requestId = _sendChainlinkRequest(req, fee);
        
        // Store request mappings
        requestToUser[requestId] = msg.sender;
        requestToFlightIndex[requestId] = userFlights[msg.sender].length - 1;

        emit EmissionRequested(requestId, _departure, _destination, _passengers, _tripType);
    }

    function fulfill(
        bytes32 _requestId,
        uint256 _emission
    ) public recordChainlinkFulfillment(_requestId) {
        emit EmissionReceived(_requestId, _emission);
        address user = requestToUser[_requestId];
        uint256 flightIndex = requestToFlightIndex[_requestId];
        
        userFlights[user][flightIndex].emission = _emission;
        userFlights[user][flightIndex].fulfilled = true;

       
    }

    function getUserFlights(address _user) public view returns (FlightEmission[] memory) {
        FlightEmission[] memory flights = userFlights[_user];
        uint256 count = flights.length;

        require(count > 0, "No flight data available");

        FlightEmission[] memory result = new FlightEmission[](count);

        for (uint256 i = 0; i < count; i++) {
            result[i] = flights[i];
        }

        return result;
    }

    function getLatestFlight(
        address _user
    ) public view returns (FlightEmission memory) {
        require(userFlights[_user].length > 0, "No flights found");
        return userFlights[_user][userFlights[_user].length - 1];
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}