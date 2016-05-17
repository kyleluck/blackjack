
/* Deck constructor */
function Deck () {
  this.cards = [];
}

/* numCards function returns number of cards */
Deck.prototype.numCards = function () {
  return this.cards.length;
};

/* draw function removes last card */
Deck.prototype.draw = function () {
  return this.cards.pop();
};

/* createNewDeck function creates a deck with 6 decks */
Deck.prototype.createNewDeck = function () {
  var cards2toAce = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  var suits = ['diamonds', 'spades', 'hearts', 'clubs'];
  var deckCards = this.cards; //save off context as context will change in jQuery each
  for (var i = 0; i < 6; i++) { //create a deck with 6 decks of cards
    $.each(suits, function( indexSuits, valueSuits ) {
      $.each(cards2toAce, function( indexCards, valueCards ) {
        var card = new Card(cards2toAce[indexCards], suits[indexSuits]);
        deckCards.push(card);
      });
    });
  }
};

/* shuffles current deck in deck.cards and returns it */
Deck.prototype.shuffleDeck = function() {
  var unshuffledDeck = this.cards;
  var shuffledDeck = [];
  var counter = unshuffledDeck.length;

  $.each(unshuffledDeck, function (index, value) {
    var insertedIntoArray = false;
    while (!insertedIntoArray) {
      var randomNumber = Math.floor(Math.random() * counter);
      if (typeof(shuffledDeck[randomNumber]) == "undefined") {
        shuffledDeck[randomNumber] = value;
        insertedIntoArray = true;
      }
    }
  });
  return shuffledDeck;
};

/* Card constructor */
function Card (point, suit) {
  this.point = point;
  this.suit = suit;
}

/* function getPointName returns the associated name of any card */
Card.prototype.getPointName = function () {
  if (this.point === 'A') {
    return 'ace';
  } else if (this.point === 'J') {
    return 'jack';
  } else if (this.point === 'Q') {
    return 'queen';
  } else if (this.point === 'K') {
    return 'king';
  }
  return this.point;
};

/* hand constructor */
function Hand () {
  this.cards = [];
}

/* addCard function adds the card passed in to a hand */
Hand.prototype.addCard = function (card) {
  this.cards.push(card);
}

/* getPoints calculates the points for a hand */
Hand.prototype.getPoints = function () {
  var sum = 0;
  this.cards.forEach(function(card) {
    if (card.point === 'A') {
      sum += 11;
    } else if (card.point === 'Q' || card.point === 'K' || card.point === 'J') {
      sum += 10;
    } else {
      sum += Number(card.point);
    }
  });
  return sum;
};



var deck = new Deck();
deck.createNewDeck(); //sets deck.cards to an unshuffledDeck of 312 cards (6 decks)
deck.cards = deck.shuffleDeck(); //sets shuffles current deck and assign new deck to deck.cards

/*create player and dealer hands */
var playerHand = new Hand();
var dealerHand = new Hand();

/*deal initial 4 cards: 2 to dealer and 2 to player*/
playerHand.addCard(deck.draw());
playerHand.addCard(deck.draw());
dealerHand.addCard(deck.draw());
dealerHand.addCard(deck.draw());

console.log(playerHand.getPoints());
console.log(dealerHand.getPoints());
