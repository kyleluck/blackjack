//creates a deck with six deck of cards (312 cards), unshuffled
function createDeck () {
  var fullDeck = [];
  var cards2toAce = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  var suits = ['diamonds', 'spades', 'hearts', 'clubs'];
  for (var i = 0; i < 6; i++) {
    $.each(suits, function( indexSuits, valueSuits ) {
      $.each(cards2toAce, function( indexCards, valueCards ) {
        fullDeck.push({suit: suits[indexSuits], point: cards2toAce[indexCards]});
      });
    });
  }
  return fullDeck;
}

/*
shuffles the deck by choosing a random number between 1 & 312
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
  var numberOfAces = 0;
  $.each(hand, function (index, value) {
    if (value.point === "J" || value.point === "Q" || value.point === "K") {
      handValue += 10;
    }
    else if (value.point === "A") {
      handValue += 11;
      numberOfAces++;
    }
    else {
      handValue += Number(value.point);
    }
  });

  //if the hand contains an Ace, use higher value that doesn't result in a bust
  if (numberOfAces > 0 && handValue > 21) {
    handValue = accountForAces(numberOfAces, handValue);
  }
  return handValue;
}

function accountForAces(numberOfAces, handValue) {
  for (var i = 1; i <= numberOfAces; i++) {
    handValue -= 10;
    if (handValue < 21) {
      return handValue;
    }
  }
  return handValue;
}

function comparePlayerToDealer(playerHand, dealerHand) {
  var playerTotal = countHand(playerHand);
  var dealerTotal = countHand(dealerHand);

  //don't show dealer total unless it's dealer's turn (turn === false)
  if (!turn) {
    $('#dealermessage').html(': ' + dealerTotal);
  }
  else {
    $('#dealermessage').html(':');
  }
  $('#playermessage').html(': ' + playerTotal);

  if (playerTotal === 21) {
    $('#playermessage').append(' Blackjack!');
    whoWon = "player";
    betting(whoWon);
    return false;
  }
  else if (dealerTotal === 21) {
    $('#dealermessage').append(' Blackjack! - You lose!');
    whoWon = "dealer";
    betting(whoWon);
    return false;
  }
  else if (playerTotal > 21) {
    $('#playermessage').append(' You busted!');
    whoWon = "dealer";
    betting(whoWon);
    return false;
  }
  else if (dealerTotal > 21) {
    $('#dealermessage').append(' You WIN! Dealer busted');
    whoWon = "player";
    betting(whoWon);
    return false;
  }
  else if (dealerTotal === playerTotal && !turn && dealerTotal >= 17) {
    $('#dealermessage').append(' Push!');
    whoWon = "push";
    betting(whoWon);
    return false;
  }
  else if (dealerTotal > playerTotal && !turn) {
    $('#dealermessage').append(' Dealer WINS!');
    whoWon = "dealer";
    betting(whoWon);
    return false;
  }
  else if (playerTotal > dealerTotal && !turn && dealerTotal >= 17) {
    $('#playermessage').append(' You WIN!');
    whoWon = "player";
    betting(whoWon);
    return false;
  }
  else {
    return true;
  }
}

//the function giveCards displays the first two cards in the
//playerHand and dealerHand arrays
function giveCards(hand, div) {
  if (div === 'dealerhand') {
    var htmlSecondCard = '<div class="col col-md-2" id="dealerholecard"><div class="animatefinal card cardback suitback"><p>Kyle Luck</p></div></div>';
  }
  else {
    var htmlSecondCard = '<div class="col col-md-2"><div class="animatefinal card suit' +
                        hand[1].suit + '"><p>' + hand[1].point +
                        '</p></div></div>';
  }
  var htmlFirstCard = '<div class="col col-md-2"><div class="animatefinal card suit' +
                      hand[0].suit + '"><p>' + hand[0].point +
                      '</p></div></div>';


  $('#' + div).html(htmlFirstCard + htmlSecondCard);
}

//logic for dealer's turn
function dealersTurn() {
  //show dealer card
  $('#dealerholecard').html('<div class="animated flipInY card suit' +
                      dealerHand[1].suit + '"><p>' + dealerHand[1].point +
                      '</p></div>');

  //get hand totals
  var playerTotal = countHand(playerHand);
  var dealerTotal = countHand(dealerHand);

  //if no winner, hit until dealer wins or busts.
  //dealer shouldn't hit on 17
  var continueGame = true;
  if (dealerTotal >= 17) {
    continueGame = comparePlayerToDealer(playerHand, dealerHand);
  }
  else {
    while (continueGame) {
      if (dealerTotal > playerTotal) {
        $('#dealermessage').append(' Dealer WINS!');
        continueGame = false;
      }
      else {
         continueGame = hit(dealerHand);
      }
    }
  }
}

function hit(playerOrDealerHand) {
  playerOrDealerHand.push(thisDeck.pop());
  var lastCardIndex = playerOrDealerHand.length - 1;
  var htmlCard = '<div class="col col-md-2"><div class="animatefinal card suit' +
                  playerOrDealerHand[lastCardIndex].suit + '"><p>' + playerOrDealerHand[lastCardIndex].point +
                  '</p></div></div>';

  if (turn) {
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

function betting(whoWon) {
  if (whoWon === "push") {
    bank = bank;
  } else if (whoWon === "dealer") {
    bank -= bet;
  } else if (whoWon === "player") {
    bank += bet;
  }

  if (bank <= 0) {
    $('.alert').html("Sorry, you're out of money! No worries, we'll replenish your bank!").show();
    bank = 500;
  }
  $('#bank').html("Bank: <p>$" + bank + "</p>");
  $('#betup').prop('disabled', false);
  $('#betdown').prop('disabled', false);

}


//arrays of objects for each player and dealer hand
var playerHand = [];
var dealerHand = [];

//thisDeck is the current deck in play. it is a shuffled deck
var thisDeck = shuffleDeck();

//variable to determine if still player's
//turn or if dealers turn. true = players turn
var turn = true;

//variable to track who won for betting
var whoWon = "noone";
//variable for bank amount
var bank = 500;
var bet = 5;

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
