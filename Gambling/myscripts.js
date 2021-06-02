$(document).ready(function(){
  
  // Variables
  balance = 5;
  play_button_enabled = true;
  cashout_button_enabled = false;
  num_of_bombs = 1;
  game_in_progress = false;
  bomb_locations = [];
  selected_tiles = [];
  bet = 0;
  winnings = 0;
  
  // Options List
  $('.options li').click(function(){
    $('.options li').each(function(){
      $(this).removeClass('selected');
    });
    $(this).addClass('selected');
    num_of_bombs = parseInt($(this).attr("id"));
  });
  
  // When play button is clicked
  $('#play_button').click(function(){
    if (play_button_enabled) {
      // Validate balance
      bet = parseFloat($('#bet_field').val());
      if (bet <= balance && bet > 0) {
        newGame();
      }else {
        // Not enough money
        consoleLog('danger', 'You do not have enough money or have not entered a bet above 0.');
      }
    }
  });
  
  // Game function
  function newGame() {
    if (!game_in_progress) {
      game_in_progress = true;
      // Deduct bet from balance
      balance = balance - bet;
      winnings = bet;
      updateWinnings();
      updateBalance();
      // Disable play button
      togglePlayButton();
      toggleCashoutButton();
      setBombLocations(num_of_bombs,1,25);
      consoleLog('info', 'Game started with '+num_of_bombs+' bombs.');
    }
  }
  
  // When command is entered
  $('#commandInput').keypress(function (e) {
    if (e.which == 13) {
      var command = $('#commandInput').val();
      switch (command) {
        case '/viewBombs':
          viewBombs();
          break;
        case '/viewNonBombs':
          viewNonBombs();
          break;
        case '/freeMoney':
          freeMoney();
          break;
        case '/clear':
          clearConsole();
          break;
        default:
          consoleLog('danger', 'Command not found.');
      }
      $('#commandInput').val("");
      return false;
    }
  });
  
  // When tile is clicked
  $('#tiles li').click(function(){
    if (game_in_progress) {
      var index = $(this).index() + 1;
      if (selected_tiles.indexOf(index) == -1) {
        selected_tiles.push(index);
        if (bomb_locations.indexOf(index) == -1) {
          // Did NOT select a bomb
          $(this).addClass('good');
          var odds = 1 - (num_of_bombs / (26 - selected_tiles.length));
          var multiplier = 1 / odds;
          var new_winnings = +(((bet * multiplier) - bet).toFixed(2));
          consoleLog('success', '+'+new_winnings);
          winnings = +((winnings + new_winnings).toFixed(2));
          updateWinnings();
        }else {
          // Did select a bomb
          $(this).addClass('bad');
          consoleLog('danger', '-'+winnings);
          toggleCashoutButton();
          game_in_progress = false;
          setTimeout(function(){
            togglePlayButton();
            winnings = 0;
            updateWinnings();
            bomb_locations = [];
            selected_tiles = [];
            $('#tiles li').each(function(){
              $(this).removeClass();
            });
            clearConsole();
          }, 3000);
        }
      }
    }
  });
  
  $('#cashout_button').click(function(){
    if (cashout_button_enabled) {
      // End game
      toggleCashoutButton();
      togglePlayButton();
      balance += +(winnings).toFixed(2);
      updateBalance();
      winnings = 0;
      updateWinnings();
      game_in_progress = false;
      bomb_locations = [];
      selected_tiles = [];
      $('#tiles li').each(function(){
        $(this).removeClass();
      });
      clearConsole();
    }
  });
  
  // Helper functions
  function clearConsole() {
    $('.console').html("");
  }
  
  function updateBalance() {
    balance = +(balance).toFixed(2);
    $('#balance').html(""+balance);
  }
  
  function updateWinnings() {
  winnings = +(winnings).toFixed(2);  $('#winnings_label').html("+"+winnings);
  }
  
  function togglePlayButton() {
    $('#play_button').toggleClass('disabled');
    if (play_button_enabled) {
      play_button_enabled = false;
    }else {
      play_button_enabled = true;
    }
  }
  
  function toggleCashoutButton() {
    $('#cashout_button').toggleClass('disabled');
    if (cashout_button_enabled) {
      cashout_button_enabled = false;
    }else {
      cashout_button_enabled = true;
    }
  }
  
  function setBombLocations(amount, min, max) {
    for (i = 0; i < amount; i++) {
      var num = Math.floor(Math.random() * max) + min;
      while (bomb_locations.indexOf(num) != -1) {
        num = Math.floor(Math.random() * max) + min;
      }
      bomb_locations.push(num);
    }
  }
  
  function consoleLog(type, message) {
    $('.console').append('<span class="message '+type+'">'+message+'</span>');
  }
  
  function viewBombs() {
    if (game_in_progress) {
      var str = "Bombs: ";
      for (var i = 1; i < 26; i++) {
        if (bomb_locations.indexOf(i) != -1) {
          str += i+", ";
        }
      }
      consoleLog('info', str);
    }else {
      consoleLog('danger', 'Game not in progress.');
    }
  }
  
  function viewNonBombs() {
    if (game_in_progress) {
      var str = "Not Bombs: ";
      for (var i = 1; i < 26; i++) {
        if (bomb_locations.indexOf(i) == -1) {
          str += i+", ";
        }
      }
      consoleLog('info', str);
    }else {
      consoleLog('danger', 'Game not in progress.');
    }
  }
  
  function freeMoney() {
    if (!game_in_progress) {
      balance += 5;
      updateBalance();
      consoleLog('success', '+5 to your balance.');
    }else {
      consoleLog('danger', 'Cannot use this command during a game.')
    }
  }
  
});