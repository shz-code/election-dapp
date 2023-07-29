const App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",

  init: () => {
    return App.initWeb3();
  },

  initWeb3: () => {
    if (typeof web3 !== "undefined") {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = ethereum;
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://127.0.0.1:7545"
      );
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: () => {
    $.getJSON("Election.json", (election) => {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();
      
      return App.render();
    });
  },

  render: async () => {
    const loader = $("#loader");
    const content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase((err, account) => {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    const electionInstance = await App.contracts.Election.deployed();
    const candidateCount = await electionInstance.candidatesCount();

    const candidatesResults = document.querySelector("#candidatesResults");
    const candidatesSelect = document.querySelector("#candidatesSelect");

    candidatesResults.innerHTML = "";
    candidatesSelect.innerHTML = "";

    for (let i = 1; i <= candidateCount; i++) {
      const candidate = await electionInstance.candidates(i);
      const id = candidate[0];
      const name = candidate[1];
      const voteCount = candidate[2];

      candidatesResults.innerHTML += `<tr><th>${id}</th><td>${name}</td><td>${voteCount}</td></tr>`;
      candidatesSelect.innerHTML += `<option value='${id}'>${name}</ option>`;
    }

    const flag = await electionInstance.voters(App.account);

    if (flag) $("form").hide();

    loader.hide();
    content.show();
  },
  castVote: async () => {
    $("#content").hide();
    $("#loader").show();
    try {
      const candidateId = $("#candidatesSelect").val();
      const electionInstance = await App.contracts.Election.deployed();
      await electionInstance.vote(candidateId, { from: App.account });
    } catch (err) {
      console.log(err);
    }
    // return App.render();
  },
  listenForEvents: async () => {
    const electionInstance = await App.contracts.Election.deployed();
    electionInstance
      .votedEvent(
        {},
        {
          fromBlock: 0,
          toBlock: "latest",
        }
      )
      .watch((err, event) => {
        console.log("event triggered", event);
        // Reload when a new vote is recorded
        App.render();
      });
  },
};

$(() => {
  $(window).load(function () {
    App.init();
  });
});
