let listenerActivate = false;

const handleAlert = (type, msg) => {
  $("#notification").html(`<div class="alert alert-${type}" role="alert">
      ${msg}
    </div>`);
  setTimeout(() => {
    $("#notification").html("");
  }, 5000);
};

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

      App.render();
    });
  },

  render: async () => {
    const loader = $("#loader");
    const content = $("#content");
    const candidatesResults = document.querySelector("#candidatesResults");
    const candidatesSelect = document.querySelector("#candidatesSelect");

    loader.show();
    content.hide();

    candidatesResults.innerHTML = "";
    candidatesSelect.innerHTML = "";

    // Load account data
    web3.eth.getCoinbase((err, account) => {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html(account);
      }
    });

    // Load contract data
    const electionInstance = await App.contracts.Election.deployed();
    const candidateCount = await electionInstance.candidatesCount();

    let winnerCk = -1;
    let winnerName = "";

    for (let i = 1; i <= candidateCount; i++) {
      const candidate = await electionInstance.candidates(i);
      const id = candidate[0];
      const name = candidate[1];
      const voteCount = candidate[2];

      // Check for winner
      if (winnerCk < Number(voteCount)) {
        winnerCk = Number(voteCount);
        winnerName = name;
      } else if (winnerCk === Number(voteCount)) {
        winnerName = "Tied";
      }

      candidatesResults.innerHTML += `<tr><th>${id}</th><td>${name}</td><td>${voteCount}</td></tr>`;
      candidatesSelect.innerHTML += `<option value='${id}'>${name}</ option>`;
    }

    $("#currentWinner").html(winnerName);
    const flag = await electionInstance.voters(App.account);

    if (flag) $("form").hide();

    loader.hide();
    content.show();
    listenerActivate = true;
  },
  castVote: async () => {
    event.preventDefault();
    $("#content").hide();
    $("#loader").show();

    try {
      const candidateId = $("#candidatesSelect").val();
      const electionInstance = await App.contracts.Election.deployed();

      // const eth = web3._extend.utils.toWei("5","ether");
      await electionInstance.vote(candidateId, { from: App.account });

    } catch (err) {
      // Catch Error
      App.render();
      handleAlert("danger", `Vote cancelled by user`);
    }
  },
  listenForEvents: async () => {
    const electionInstance = await App.contracts.Election.deployed();

    electionInstance.votedEvent({}, (err, event) => {
      // Reload when a new vote is recorded
      // Trigger new render only when the initial load is complete
      if (listenerActivate) {
        App.render();
        handleAlert(
          "dark",
          `New vote casted to candidate ${event.args._candidateId.toNumber()}`
        );
      }
    });
  },
};

$(() => {
  $(window).load(() => {
    App.init();
  });
});
