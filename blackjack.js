//creates a 52 cards deck, unshuffled
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

//shuffles the deck by choosing a random number between 1 & 52
//and inserting into a new array at that index
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
  $('#dealermessage').html(': ' + dealerTotal);
  $('#playermessage').html(': ' + playerTotal);

  if (playerTotal === 21) {
    $('#playermessage').append(' Blackjack!');
  }
  else if (dealerTotal === 21) {
    $('#dealermessage').append(' Dealer Blackjack! - You lose!');
  }
  else if (playerTotal > 21) {
    $('#playermessage').append(' You busted!');
  }
  else if (dealerTotal > 21) {
    $('#dealermessage').append(' You WIN! Dealer busted');
  }
  else if (playerTotal > dealerTotal) {
    //CHANGE THIS IN THE FUTURE
    console.log(' You WIN!');
  }
  else {
    //CHANGE THIS IN THE FUTURE
    console.log(' Dealer wins');
  }
}

//the function giveCards displays the first two cards in the
//playerHand and dealerHand arrays
function giveCards(hand, div) {
  var htmlFirstCard = '<div class="col col-md-2"><div class="card suit' +
                      hand[0].suit + '"><p>' + hand[0].point +
                      '</p></div></div>';
  var htmlSecondCard = '<div class="col col-md-2"><div class="card suit' +
                      hand[1].suit + '"><p>' + hand[1].point +
                      '</p></div></div>';

  $('#' + div).html(htmlFirstCard + htmlSecondCard);
}

//arrays of objects for each player and dealer hand
var playerHand = [];
var dealerHand = [];

//thisDeck is the current deck in play. it is a shuffled deck
var thisDeck = shuffleDeck();

//the deal function simply works with the three
//arrays of objects: playerHand, dealerHand, and
//thisDeck.
deal(thisDeck);

//variable to determine if still player's
//turn or if dealers turn. true = players turn
var turn = true;

$(function () {
  $('#deal').click(function() {
    giveCards(playerHand, "playerhand");
    giveCards(dealerHand, "dealerhand");
    comparePlayerToDealer(playerHand, dealerHand);
  });

  $('#hit').click(function() {
    playerHand.push(thisDeck.pop());
    var lastCardIndex = playerHand.length - 1;
    var htmlCard = '<div class="col col-md-2"><div class="card suit' +
                    playerHand[lastCardIndex].suit + '"><p>' + playerHand[lastCardIndex].point +
                    '</p></div></div>';
    $('#playerhand').append(htmlCard);
    comparePlayerToDealer(playerHand, dealerHand);
  });

  $('#stand').click(function() {
    turn = false;
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
