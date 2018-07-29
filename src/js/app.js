App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('NewsFact.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var NewsFactArtifact = data;
      App.contracts.NewsFact = TruffleContract(NewsFactArtifact);

      // Set the provider for our contract
      App.contracts.NewsFact.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.loadArticles();
    });

    return App.bindEvents();
  },


  loadArticles: function() {
    var articleInstance;
    var grid = $('.news-grid');
    var template = $('.article');

    App.contracts.NewsFact.deployed().then(function(instance) {
      articleInstance = instance; return articleInstance.getAllArticles.call();}).then(function(articles) {
        console.log(articles.length);
        for (i = 0; i < articles.length; i++) {
          console.log(articles[0]);
          template.find('.title').text(articles[0][i]);
          template.find('.author').text(articles[1][i]);
          template.find('.quality').text(articles[2][i] + " Rep. Points");
          template.find('.link').href = articles[3][i];
          template.find('.holder').text(i);

          console.log(template);
          grid.append(template.html());
        }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.publishArt);
    $(document).on('click', '#see-profile', App.loadProfile);
    $(document).on('click', '#see-publish', App.loadPublish);
    $(document).on('click', '.vote-positive', App.vote_positive);
    $(document).on('click', '.vote-negative', App.vote_negative);
  },


  vote_positive: function(event) {
    event.preventDefault();
    ids = $(event.target).find(".holder").innerText;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      App.contracts.NewsFact.deployed().then(function(instance){return instance.voteArticle(parseInt(ids),true);});
    });
  },


  vote_negative: function(event) {
    event.preventDefault();
    ids = $(event.target).find(".holder").innerText;
    console.log(("wuddup"));

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      App.contracts.NewsFact.deployed().then(function(instance){return instance.voteArticle(parseInt(ids),false);});
    });
  },


  loadProfile: function(event) {
    event.preventDefault();
    document.getElementById('publish').style.display = 'none';
    document.getElementById('feed').style.display = 'none';
    document.getElementById('profile').style.display = 'inline';
  },


  loadPublish: function(event) {
    event.preventDefault();
    document.getElementById('feed').style.display = 'none';
    document.getElementById('profile').style.display = 'none';
    document.getElementById('publish').style.display = 'inline';
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;
    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  publishArt: function(event) {
    event.preventDefault();
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      title = String($('#form_title')[0].value);
      link = String($('#form_link')[0].value);
      App.contracts.NewsFact.deployed().then(function(instance){return instance.publishArticle(481247,title,link);});
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
