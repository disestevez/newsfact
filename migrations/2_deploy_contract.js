var NewsFact = artifacts.require("NewsFact");

module.exports = function(deployer) {
  deployer.deploy(NewsFact);
};
