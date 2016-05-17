
/* Deck constructor */
function Deck(n) {
  this.cards = [];
  var cards2toAce = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  var suits = ['diamonds', 'spades', 'hearts', 'clubs'];
  var deckCards = this.cards; //save off context as context will change in jQuery each
  for (var i = 0; i < n; i++) { //create a deck with n decks of cards
    $.each(suits, function( indexSuits, valueSuits ) {
      $.each(cards2toAce, function( indexCards, valueCards ) {
        var card = new Card(cards2toAce[indexCards], suits[indexSuits]);
        deckCards.push(card);
      });
    });
  }
}

/* numCards function returns number of cards */
Deck.prototype.numCards = function() {
  return this.cards.length;
};

/* draw function removes last card */
Deck.prototype.draw = function() {
  return this.cards.pop();
};

/* shuffles current deck in deck.cards and returns it */
Deck.prototype.shuffleDeck = function() {
  var unshuffledDeck = this.cards;
  var shuffledDeck = [];
  var counter = unshuffledDeck.length;

  $.each(unshuffledDeck, function(index, value) {
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
function Card(point, suit) {
  this.point = point;
  this.suit = suit;
}

/* function getPointName returns the associated name of any card */
Card.prototype.getPointName = function() {
  if (this.point === 'A') {
    return 'Ace';
  } else if (this.point === 'J') {
    return 'Jack';
  } else if (this.point === 'Q') {
    return 'Queen';
  } else if (this.point === 'K') {
    return 'King';
  }
  return this.point;
};

/* hand constructor */
function Hand() {
  this.cards = [];
}

/* addCard function adds the card passed in to a hand */
Hand.prototype.addCard = function(card) {
  this.cards.push(card);
}

/* getPoints calculates the points for a hand */
Hand.prototype.getPoints = function() {
  // makes a copy of the hand array, so we don't modify it
  var hand = this.cards;
  hand = hand.slice(0);

  // sort the array in reverse point order, so Aces are at the end for point decision between 1 or 11
  function compare(card1, card2) {
    return Number(card2.point) - Number(card1.point);
  }

  hand.sort(compare);
  var sum = 0;
  for (var i = 0; i < hand.length; i++) {
    var card = hand[i];
    if (card.point === 'K' || card.point === 'Q' || card.point === 'J') {
      sum = sum + 10;
    } else if (card.point === 'A') {
      if (sum + 11 <= 21) {
        sum = sum + 11;
      } else {
        sum = sum + 1;
      }
    } else {
      sum = sum + Number(card.point);
    }
  }
  return sum;
};

/* Blackjack game constructor */
function Blackjack() {

}

/* compare constructor */
function CompareHands(playerHand, dealerHand) {
  this.playerHand = playerHand;
  this.dealerHand = dealerHand;
}

CompareHands.prototype.compare = function() {
  playerHandPoints = this.playerHand.getPoints();
  dealerHandPoints = this.dealerHand.getPoints();
  if (playerHandPoints === 21) {
    return "player blackjack";
  } else if(dealerHandPoints === 21) {
    return "dealer balckjack";
  }
  return "neither had blackjack";
};

var deck = new Deck(6); //sets deck.cards to an unshuffledDeck 6 decks
//deck.createNewDeck(6); //sets deck.cards to an unshuffledDeck 6 decks
deck.cards = deck.shuffleDeck(); //sets shuffles current deck and assign new deck to deck.cards

/*create player and dealer hands */
var playerHand = new Hand();
var dealerHand = new Hand();

/*deal initial 4 cards: 2 to dealer and 2 to player*/
playerHand.addCard(deck.draw());
playerHand.addCard(deck.draw());
dealerHand.addCard(deck.draw());
dealerHand.addCard(deck.draw());

var compareHands = new CompareHands(playerHand, dealerHand);
console.log(compareHands.compare());

/*just logging hands for testing/visualization*/
// console.log(playerHand.getPoints());
// console.log(dealerHand.getPoints());

//variable to determine if still player's
//turn or if dealers turn. true = players turn
var turn = true;

//variable to track who won for betting
var whoWon = "noone";
//variable for bank amount
var bank = 500;
var bet = 5;

/*
$(function () {

  disableButtons(true);
  $('.alert').hide();
  $('#bank').html("<p>Bank: $" + bank + "</p>");
  $('#bet').html("<p>Bet: $" + bet + "</p>");

  $('#betup').click(function() {
    bet += 5;
    if (bet > bank) {
      bet -= 5;
    } else if (bet >= 100) {
      bet = 100;
    }
    $('#bet').html("<p> Bet: $" + bet + "</p>");
  });

  $('#betdown').click(function() {
    if (bet <= 5) {
      bet = 5;
    } else {
      bet -= 5;
    }
    $('#bet').html("<p> Bet: $" + bet + "</p>");
  });

  $('#betmax').click(function() {
      bet = 100;
      $('#bet').html("<p>Bet: $" + bet + "</p>");
  });

  $('#betmin').click(function() {
      bet = 5;
      $('#bet').html("<p>Bet: $" + bet + "</p>");
  });

  $('#deal').click(function() {
    $('.alert').hide();
    $('#betup').prop('disabled', true);
    $('#betdown').prop('disabled', true);
    deal(thisDeck);
    turn = true;
    disableButtons(false);
    giveCards(playerHand, "playerhand");
    giveCards(dealerHand, "dealerhand");
    var continueGame = comparePlayerToDealer(playerHand, dealerHand);
    if (!continueGame) {
      disableButtons(true);
    }
  });

  $('#hit').click(function() {
    var continueGame = hit(playerHand);
    if (!continueGame) {
      disableButtons(true);
    }
  });

  $('#stand').click(function() {
    turn = false;
    disableButtons(true);
    dealersTurn();
  });

});
*/
