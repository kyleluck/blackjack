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

/*
shuffles the deck by choosing a random number between 1 & 52
and inserting into a new array at that index
*/
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

/*
give dealer and player 2 cards; get new shuffled deck if needed
*/
function deal(deck) {
  playerHand = [];
  dealerHand = [];
  if (deck.length <= 15) {
    thisDeck = shuffleDeck();
    deck = thisDeck;
  }
  playerHand.push(deck.pop());
  playerHand.push(deck.pop());
  dealerHand.push(deck.pop());
  dealerHand.push(deck.pop());
}

//calculates value of a hand (array of cards) and returns the hand's value
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
    return false;
  }
  else if (dealerTotal === 21) {
    $('#dealermessage').append(' Dealer Blackjack! - You lose!');
    return false;
  }
  else if (playerTotal > 21) {
    $('#playermessage').append(' You busted!');
    return false;
  }
  else if (dealerTotal > 21) {
    $('#dealermessage').append(' You WIN! Dealer busted');
    return false;
  }
  else if (dealerTotal === playerTotal && !turn && dealerTotal >= 18) {
    $('#dealermessage').append(' Draw!');
    return false;
  }
  else if (dealerTotal > playerTotal && !turn) {
    $('#dealermessage').append(' Dealer WINS!');
    return false;
  }
  else {
    return true;
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

//logic for dealer's turn
function dealersTurn() {
  //get hand totals
  var playerTotal = countHand(playerHand);
  var dealerTotal = countHand(dealerHand);

  //if no winner, hit until dealer wins or busts
  var continueGame = true;
  while (continueGame) {
    if (playerTotal < dealerTotal) {
      $('#dealermessage').append(' Dealer WINS!');
      continueGame = false;
    }
    else {
       continueGame = hit(dealerHand);
    }
  }
}

function hit(playerOrDealerHand) {
  playerOrDealerHand.push(thisDeck.pop());
  var lastCardIndex = playerOrDealerHand.length - 1;
  var htmlCard = '<div class="col col-md-2"><div class="card suit' +
                  playerOrDealerHand[lastCardIndex].suit + '"><p>' + playerOrDealerHand[lastCardIndex].point +
                  '</p></div></div>';

  if (turn === true) {
    //players turn
    $('#playerhand').append(htmlCard);
  }
  else {
    //dealers turn
    $('#dealerhand').append(htmlCard);
  }

  var continueGame = comparePlayerToDealer(playerHand, dealerHand);
  return continueGame;
}

function disableButtons(trueOrFalse) {
  $('#hit').prop('disabled', trueOrFalse);
  $('#stand').prop('disabled', trueOrFalse);
}


//arrays of objects for each player and dealer hand
var playerHand = [];
var dealerHand = [];

//thisDeck is the current deck in play. it is a shuffled deck
var thisDeck = shuffleDeck();

//variable to determine if still player's
//turn or if dealers turn. true = players turn
var turn = true;

$(function () {

  disableButtons(true);

  $('#deal').click(function() {

    //the deal function simply works with the three
    //arrays of objects: playerHand, dealerHand, and
    //thisDeck.
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

/*
  gameOver function - disable hit/stand buttons
  A can be 1 or 11
  extract relevant functions / variables
*/
