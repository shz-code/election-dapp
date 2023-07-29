const Election = artifacts.require("./Election.sol");

contract("Election", (accounts) => {
  it("Initialize with two candidates", async () => {
    const electionInstance = await Election.deployed();
    const candidateCount = await electionInstance.candidatesCount();
    assert.equal(candidateCount, 2);
  });

  it("Initializes 2 candidates with correct values", async () => {
    const electionInstance = await Election.deployed();

    const candidate1 = await electionInstance.candidates(1);
    assert.equal(candidate1[0], 1, "contains the correct id");
    assert.equal(candidate1[1], "Candidate 1", "contains the correct name");
    assert.equal(candidate1[2], 0, "contains the correct votes count");

    const candidate2 = await electionInstance.candidates(2);
    assert.equal(candidate2[0], 2, "contains the correct id");
    assert.equal(candidate2[1], "Candidate 2", "contains the correct name");
    assert.equal(candidate2[2], 0, "contains the correct votes count");
  });

  it("Allows a voter to cast a vote", async () => {
    const electionInstance = await Election.deployed();
    const candidateId = 1;
    // Vote Function
    const receipt = await electionInstance.vote(candidateId, { from: accounts[0] });

    // Check for event trigger
    assert.equal(receipt.logs.length, 1, "an event was triggered");
    assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
    assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");

    // Check if vote was successful
    const res = await electionInstance.voters(accounts[0]);
    assert(res, "Voted Successfully");
    // Check if voteCount increased
    const candidate = await electionInstance.candidates(1);
    const voteCount =  candidate[2];
    assert.equal(voteCount, 1);
  });

  // Candidate 1 has 1 vote, Candidate 2 has 0 vote | account[0] already voted
  it("throws an exception for invalid candidates", async () => {
    const electionInstance = await Election.deployed();

    try {
      await electionInstance.vote(5, {from: accounts[1]});
    }
    catch(err) {
      const candidate1 = await electionInstance.candidates(1);
      const voteCount1 = candidate1[2];
      assert.equal(voteCount1 , 1, "Candidate 1 vote not changed");

      const candidate2 = await electionInstance.candidates(2);
      const voteCount2 = candidate2[2];
      assert.equal(voteCount2 , 0, "Candidate 2 vote not changed");
    }
  });
});
