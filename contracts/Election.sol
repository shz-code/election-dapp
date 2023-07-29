// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Voter {
        uint id;
        string name;
        address user;
    }
    mapping(address => bool) public voters;

    event votedEvent(uint indexed _candidateId);


    // Read/write candidates
    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public votes;
    

    // Store Candidates Count
    uint public candidatesCount;

    constructor() public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate(string memory _name) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender],"You have already voted");

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount,"Invalid candidate");

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;
        emit votedEvent(_candidateId);
    }

}
