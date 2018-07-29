pragma solidity ^0.4.22;
pragma experimental ABIEncoderV2;

contract NewsFact {

    struct Journalist {
        string name;
        string email;
        string website;
        uint[] articles;
        uint[1000] votes;
        uint reputation;
    }

    struct Article {
        bytes32 _hash;
        uint[] votes;
        string link;
        string title;
        Journalist author;
        uint quality;
    }


    mapping(address => Journalist) public journalists;
    Article[] public articles;


    function publishArticle(bytes32 __hash, string _link, string _title) public {
        uint[] storage _votes;
        uint _quality = journalists[msg.sender].reputation;
        articles.push(Article({
            _hash: __hash,
            votes: _votes,
            quality: _quality,
            link: _link,
            title: _title,
            author: journalists[msg.sender]
        }));
        journalists[msg.sender].articles.push(articles.length-1);
    }


    function voteArticle(uint id, bool real) public {
        uint reps = 0;
        if (real == true){
            reps = journalists[msg.sender].reputation;
        }else{
            reps = -journalists[msg.sender].reputation;
        }
        articles[id].quality = articles[id].quality + reps;
        articles[id].votes.push(reps);
        journalists[msg.sender].votes[id] = reps;
    }


	function getNumberArticles() public view returns(uint){
		return articles.length;
	}



    function getAllArticles()
        public
        returns (string[], string[], uint[], string[], bytes32[])
    {
        string[] memory titles = new string[](articles.length);
        string[] memory authors = new string[](articles.length);
        uint[] memory quality = new uint[](articles.length);
        string[] memory links = new string[](articles.length);
        bytes32[] memory hashes = new bytes32[](articles.length);

        for (uint i = 0; i < articles.length; i++) {
            titles[i] = articles[i].title;
            authors[i] = articles[i].author.name;
            quality[i] = articles[i].quality;
            links[i] = articles[i].link;
            hashes[i] = articles[i]._hash;
        }

        return (titles,authors,quality,links,hashes);
    }


    function setJournalistData(address target, uint _reputation, string _name) public {
        journalists[target].reputation = _reputation;
        journalists[target].name = _name;
    }


	function getUserArticles(address addr) public view returns(uint[]){
		return journalists[addr].articles;
	}


	function getArticle(uint id) public constant returns(string, string, uint, string, bytes32, uint[]) {
		return (articles[id].title, articles[id].author.name, articles[id].quality, articles[id].link, articles[id]._hash, articles[id].votes);
	}
}