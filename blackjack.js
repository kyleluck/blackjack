
function createDeck () {
  var fullDeck = [];
  var cards2toAce = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  var suits = ['diamonds', 'spades', 'hearts', 'clubs'];
  $.each(suits, function( indexSuits, valueSuits ) {
    $.each(cards2toAce, function( indexCards, valueCards ) {
      fullDeck.push({suit: suits[indexSuits], point: cards2toAce[indexCards]});
    });
  });
  return fullDeck;
}

function shuffleDeck () {
  var unshuffledDeck = createDeck();
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
}

function deal(deck) {
  playerHand.push(deck.pop());
  playerHand.push(deck.pop());
  dealerHand.push(deck.pop());
  dealerHand.push(deck.pop());
}

function countHand(hand) {
  var handValue = 0;
  $.each(hand, function (index, value) {
    if (value.point === "J" || value.point === "Q" || value.point === "K") {
      handValue += 10;
    }
    else if (value.point === "A") {
      handValue += 11;
    }
    else {
      handValue += Number(value.point);
    }
  });
  return handValue;
}

function comparePlayerToDealer(playerHand, dealerHand) {
  var playerTotal = countHand(playerHand);
  var dealerTotal = countHand(dealerHand);
  if (playerTotal === 21) {
    console.log('Blackjack!');
  }
  else if (dealerTotal === 21) {
    console.log('Dealer Blackjack! - You lose.');
  }
  else if (playerTotal > 21) {
    console.log('You busted');
  }
  else if (dealerTotal > 21) {
    console.log('You WIN! Dealer busted');
  }
  else if (playerTotal > dealerTotal) {
    console.log('You WIN!');
  }
  else {
    console.log('Dealer wins');
  }
}

function giveCards(hand, div) {
  var htmlFirstCard = '<div class="col col-md-2"><div class="card suit' +
                      hand[0].suit + '"><p>' + hand[0].point +
                      '</p></div></div>';
  var htmlSecondCard = '<div class="col col-md-2"><div class="card suit' +
                      hand[1].suit + '"><p>' + hand[1].point +
                      '</p></div></div>';

  $('#' + div).html(htmlFirstCard + htmlSecondCard);
}

var playerHand = [];
var dealerHand = [];
var thisDeck = shuffleDeck();

$(function () {
  $('#deal').click(function() {
    deal(thisDeck);
    giveCards(playerHand, "playerhand");
    giveCards(dealerHand, "dealerhand");
    comparePlayerToDealer(playerHand, dealerHand);
  });
});
//deck & hand are arrays of objects ^
//**function to generate deck
//**function to shuffle cards
//**function count points in hand
//**function to compare dealer hand vs player hand
//**function to deal: array.pop to deal
//function to clear table (on deal)
//remember ace is 1 or 11
//player blackjack automatically wins
