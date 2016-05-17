
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
  this.cards = shuffledDeck; //assign back to unshuffled deck
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

//**************************************************//
function disableButtons(trueOrFalse) {
  $('#hit').prop('disabled', trueOrFalse);
  $('#stand').prop('disabled', trueOrFalse);
}

//the function giveCards displays the first two cards in the
//playerHand and dealerHand arrays
function giveCards(hand, div) {
  if (div === 'dealerhand') {
    var htmlSecondCard = '<div class="col col-md-2" id="dealerholecard"><div class="animatefinal card cardback suitback"><p>Kyle Luck</p></div></div>';
  }
  else {
    var htmlSecondCard = '<div class="col col-md-2"><div class="animatefinal card suit' +
                        hand.cards[1].suit + '"><p>' + hand.cards[1].point +
                        '</p></div></div>';
  }
  var htmlFirstCard = '<div class="col col-md-2"><div class="animatefinal card suit' +
                      hand.cards[0].suit + '"><p>' + hand.cards[0].point +
                      '</p></div></div>';


  $('#' + div).html(htmlFirstCard + htmlSecondCard);
}

function comparePlayerToDealer(playerHand, dealerHand) {
  var playerTotal = playerHand.getPoints();
  var dealerTotal = dealerHand.getPoints();

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

function hit(playerOrDealerHand) {
  playerOrDealerHand.addCard(deck.draw());;
  var lastCardIndex = playerOrDealerHand.cards.length - 1;
  var htmlCard = '<div class="col col-md-2"><div class="animatefinal card suit' +
                  playerOrDealerHand.cards[lastCardIndex].suit + '"><p>' + playerOrDealerHand.cards[lastCardIndex].point +
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

//logic for dealer's turn
function dealersTurn() {
  //show dealer card
  $('#dealerholecard').html('<div class="animated flipInY card suit' +
                      dealerHand.cards[1].suit + '"><p>' + dealerHand.cards[1].point +
                      '</p></div>');

  //get hand totals
  var playerTotal = playerHand.getPoints();
  var dealerTotal = dealerHand.getPoints();

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
/*create player and dealer hands */
var playerHand = new Hand();
var dealerHand = new Hand();

//variable to determine if still player's
//turn or if dealers turn. true = players turn
var turn = true;

//variable to track who won for betting
var whoWon = "noone";
//variable for bank amount
var bank = 500;
var bet = 5;

//create deck and shuffle
var deck = new Deck(6); //sets deck.cards to an unshuffledDeck 6 decks
deck.shuffleDeck(); //sets shuffles current deck and assign new deck to deck.cards

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

    //reset hands
    playerHand.cards = [];
    dealerHand.cards = [];
    
    /*deal initial 4 cards: 2 to dealer and 2 to player*/
    playerHand.addCard(deck.draw());
    playerHand.addCard(deck.draw());
    dealerHand.addCard(deck.draw());
    dealerHand.addCard(deck.draw());

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