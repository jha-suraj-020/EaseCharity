pragma solidity ^0.6.0;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns(address[] memory){
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;                     // it holds the description of the resquest
        uint value;                             // amount of value needed to fullfil the request
        address payable recipient;              // address the vendor or supplier of resources
        bool compelete;                         // it sees if the request has been fullfilled or not
        uint approvalCount;                     // count of people how voted true for this request to be granted
        mapping(address => bool) approvals;     //refernce type, 
    }   
    
    address public manager;                     // the user(manager) who created the Campaign
    uint public minimumContribution;            // min amount that can be contributed to the campaign
    mapping(address => bool) public approvers;   // list of people who have donated to our compaign
    uint public approversCount;                 //we cant map through the above mapping, it maintains the count of people donated
    Request[] public requests;                  //requests created by manager, for his/her needs 
    
    modifier restricted() {
        require(msg.sender == manager);         // require condition, on manager can continue with this
        _;
    }
    
    constructor(uint minimum, address creator) public {         //this constructor sets the manager address and 
        //manager = msg.sender;                                // min amount in the respective variables
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable{                   //with this function you can donate to the campaign
        require(msg.value > minimumContribution);           //checks min contributions condition
        approvers[msg.sender] = true;                       // if true, adds it too donated peoples list
        approversCount++;                                   // increases the approvers count
    }
    
    function createRequest(string memory description, uint value, address payable recipient) 
        public payable restricted {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           compelete: false,
           approvalCount: 0
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        //Request storage request = requests[index];
        
        require(approvers[msg.sender]);   // checks if he donated to the campaign or not
        require(!requests[index].approvals[msg.sender]);  //checks if already voted for the request or not
         
        requests[index].approvals[msg.sender] = true;
        requests[index].approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted{
        //Request storage request = requests[index];
        require(!requests[index].compelete);
        require(requests[index].approvalCount > (approversCount/2));
        
        requests[index].compelete = true;
        requests[index].recipient.transfer(requests[index].value);
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
          minimumContribution,
          address(this).balance,
          requests.length,
          approversCount,
          manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

} 


