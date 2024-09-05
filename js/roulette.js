// Code by kreedy
var countDown = 10000;
var speed = 10;
var showSettings = false;
var autoIncrement = true;
var freerewardLimit = true;

var sound_rolling = new Audio("rolling.wav");
var sound_done = new Audio("tone.wav");
sound_rolling.volume = 0.2;
sound_done.volume = 0.2;

var isRolling = false;
var distanceToCover = 0;
var coveredDistance = 0;
var manualRoll = false;
var blockIncrement = false;
var freeCoins = 1000;
var balance = 0;
var betAmount = 0;
var totalRed = 0;
var totalGreen = 0;
var totalBlack = 0;
var betCount = 0;
var enableBetting = true;
var rollsHistory = [];

function numberToColor(num) {
    if (num == 0) {
        return "green";
    } else if (num < 8) {
        return "red";
    } else {
        return "black";
    }
}

function toggleSettings() {
    $("#settings").toggle();
    if (showSettings) {
        showSettings = false;
        $("#settingsBtn").html("Hide settings");
    } else {
        showSettings = true;
        $("#settingsBtn").html("Show settings");
    }
}

$("input[name=autoIncrement]").change(function() {
    autoIncrement = !autoIncrement;
});

$("input[name=freerewardLimit]").change(function() {
    freerewardLimit = !freerewardLimit;
});

$("#speed").change(function() {
    speed = $("#speed").val();
});

var $countDownValue = $("#countDownValue");
var $countDownSetBtn = $("#countDownSetBtn");

$countDownSetBtn.click(function() {
    countDown = Number($countDownValue.val());
    createAlert("success", "Countdown has been set to <b>" + countDown + "</b>");
});

function createAlert(type, content) {
    $("#alerts").html("<div class=\"alert alert-" + type + " fade in alert-dismissable\" id=\"alert\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\" title=\"close\"></a><span>" + content + "</span></div>");
    setTimeout(function() {
        $("[data-dismiss=alert]").trigger({
            type: "click"
        });
    }, 2000);
}

var historyHtml = $("#history-numbers");

function updateHistory(roll) {
    rollsHistory.push(roll);
    var historyRange;
    if (rollsHistory.length <= 10) historyRange = 0;
    else historyRange = rollsHistory.length - 10;
    var rolledNumbersHtml = "";
    for (var i = rollsHistory.length - 1; i >= historyRange; i--)
        rolledNumbersHtml += "<div class=\"ball ball-" + numberToColor(rollsHistory[i]) + "\">" + rollsHistory[i] + "</div>";
    historyHtml.html(rolledNumbersHtml);
}

function updateBetAmount() {
    betAmount = $("#bet").val();
}

function addBalance(howMuch) {
    countUp("balance", balance, balance + howMuch);
    balance += howMuch;
}

$("#bet").change(function() {
    betAmount = parseInt($("#bet").val());
})

function increseBet(howMuch) {
    betAmount += howMuch;
    var current = parseInt($("#bet").val());
    if (!current) current = 0;
    $("#bet").val(current + parseInt(howMuch));
}

function halfBet() {
    var current = parseInt($("#bet").val());
    betAmount = (betAmount / 2).round(0);
    $("#bet").val((current / 2).round(0));
}

$("#clearBetAmount").click(function() {
    betAmount = 0;
    $("#bet").val("");
});

function toggleBetting() {
    if (enableBetting) {
        $("#betOnRed").prop("disabled", true);
        $("#betOnGreen").prop("disabled", true);
        $("#betOnBlack").prop("disabled", true);
        enableBetting = false;
    } else {
        $("#betOnRed").prop("disabled", false);
        $("#betOnGreen").prop("disabled", false);
        $("#betOnBlack").prop("disabled", false);
        enableBetting = true;
    }
}

function countUp(element, before, after) {
    var change = new CountUp(element, before, after, 0, 1);
    change.start();
}

function resetBets() {
    totalRed = 0;
    totalGreen = 0;
    totalBlack = 0;
    betCount = 0;
    $("#redCoins").html("");
    $("#greenCoins").html("");
    $("#blackCoins").html("");
}

function roundEnd(winner) {
    var endDelay = 2400;
    if (winner == "red") {
        if (totalRed > 0) {
            $("#redCoins").css("color", "#1aca18");
            countUp("redCoins", totalRed, totalRed * 2);
            addBalance(totalRed * 2);

        }
        if (totalGreen > 0) {
            $("#greenCoins").css("color", "#e0150a");
            countUp("greenCoins", totalGreen, 0);

        }
        if (totalBlack > 0) {
            $("#blackCoins").css("color", "#e0150a");
            countUp("blackCoins", totalBlack, 0);
        }
        if ((totalBlack + totalGreen + totalRed) > 0) {
            setTimeout(function() {
                $("#redCoins").css("color", "#ffffff");
                $("#greenCoins").css("color", "#ffffff");
                $("#blackCoins").css("color", "#ffffff");
                resetBets();
            }, endDelay);
        }
    } else if (winner == "green") {
        if (totalRed > 0) {
            $("#redCoins").css("color", "#e0150a");
            countUp("redCoins", totalRed, 0);
        }
        if (totalGreen > 0) {
            $("#greenCoins").css("color", "#1aca18");
            countUp("greenCoins", totalGreen, totalGreen * 14);
            addBalance(totalGreen * 14);
        }
        if (totalBlack > 0) {
            $("#blackCoins").css("color", "#e0150a");
            countUp("blackCoins", totalBlack, 0);
        }
        if ((totalBlack + totalGreen + totalRed) > 0) {
            setTimeout(function() {
                $("#redCoins").css("color", "#ffffff");
                $("#greenCoins").css("color", "#ffffff");
                $("#blackCoins").css("color", "#ffffff");
                resetBets();
            }, endDelay);
        }
    } else if (winner == "black") {
        if (totalRed > 0) {
            $("#redCoins").css("color", "#e0150a");
            countUp("redCoins", totalRed, 0);
        }
        if (totalGreen > 0) {
            $("#greenCoins").css("color", "#e0150a");
            countUp("greenCoins", totalGreen, 0);
        }
        if (totalBlack > 0) {
            $("#blackCoins").css("color", "#1aca18");
            countUp("blackCoins", totalBlack, totalBlack * 2);
            addBalance(totalBlack * 2);
        }
        if ((totalBlack + totalGreen + totalRed) > 0) {
            setTimeout(function() {
                $("#redCoins").css("color", "#ffffff");
                $("#greenCoins").css("color", "#ffffff");
                $("#blackCoins").css("color", "#ffffff");
                resetBets();
            }, endDelay);
        }
    }
}

function bet(color) {
    if (betAmount <= balance) {
        if (betAmount >= 10) {
            switch (color) {
                case 1:
                    if (betCount < 3) {
                        betCount++;
                        createAlert("success", "Bet placed! <b>" + betCount + "/3</b>");
                        countUp("redCoins", totalRed, totalRed + betAmount);
                        totalRed += betAmount;
                        countUp("balance", balance, balance - betAmount);
                        balance -= betAmount;
                    } else {
                        createAlert("danger", "Maximum bet per round is <b>3</b>!");
                    }
                    break;
                case 2:
                    if (betCount < 3) {
                        betCount++;
                        createAlert("success", "Bet placed! <b>" + betCount + "/3</b>");
                        countUp("greenCoins", totalGreen, totalGreen + betAmount);
                        totalGreen += betAmount;
                        countUp("balance", balance, balance - betAmount);
                        balance -= betAmount;
                    } else {
                        createAlert("danger", "Maximum bet per round is <b>3</b>!");
                    }
                    break;
                case 3:
                    if (betCount < 3) {
                        betCount++;
                        countUp("blackCoins", totalBlack, totalBlack + betAmount);
                        createAlert("success", "Bet placed! <b>" + betCount + "/3</b>");
                        totalBlack += betAmount;
                        countUp("balance", balance, balance - betAmount);
                        balance -= betAmount;
                    } else {
                        createAlert("danger", "Maximum bet per round is <b>3</b>!");
                    }
                    break;
            }
        } else {
            createAlert("danger", "Minimum bet amount is <b>10</b>!");
        }
    } else {
        createAlert("danger", "Insufficient funds!");
    }
}

function collectCoins() {
    if (balance < 100 || !freerewardLimit) {
        addBalance(freeCoins);
        createAlert("success", "You have collected " + freeCoins + " coins.")
    } else createAlert("warning", "You cannot collect free coins if your balance is more than 100.")
}

var $g_secret = $('#g_secret');
var $g_public = $('#g_public');
var $g_round = $('#g_round');

var $s_secret = $('#s_secret');
var $s_public = $('#s_public');
var $s_round = $('#s_round');

var $v_secret = $g_secret.val();
var $v_public = $g_public.val();
var $v_round = $g_round.val();

function resetVar(what) {
    if (what == "secret") {
        var generated = hex_sha256(randomStr());
        $g_secret.val(generated);
        $v_secret = generated;
    } else if (what == "public") {
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1;
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        var ymd = year * 10000 + month * 100 + day;
        $g_public.val(ymd);
        $v_public = ymd;
    } else if (what == "round") {
        $g_round.val("1");
        $v_round = 1;
    } else if (what == "countdown") {
        countDown = 10000;
        $("#countDownValue").val(10000);
    }
}

if ($v_secret == "") resetVar("secret");
if ($v_public == "") resetVar("public");
if ($v_round == "") resetVar("round");

$s_secret.click(function() {
    $v_secret = $g_secret.val();
    createAlert("success", "Secret has been set to <b>" + $v_secret + "</b>");
});
$s_public.click(function() {
    $v_public = $g_public.val();
    createAlert("success", "Public has been set to <b>" + $v_public + "</b>");
});
$s_round.click(function() {
    $v_round = $g_round.val();
    createAlert("success", "Round has been set to <b>" + $v_round + "</b>");
    if (isRolling) blockIncrement = true;
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomStr() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < getRandomInt(48, 64); i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function resolveHash(s, p, r) {
    var hash = hex_sha256(s + "-" + p.toString() + "-" + r);
    return hash;
}

function generator(s, p, r) {
    var roll = parseInt(resolveHash(s, p, r).substring(0, 8), 16) % 15;
    return roll;
}

var $case = $("#case");
var $pbtext = $("#progress-bar-text");
var $pb = $("#progress");

function getCurrentTime() {
    var d = new Date();
    return d.getTime();
}

Number.prototype.round = function(decimalPlace) {
    return +(Math.round(this + "e+" + decimalPlace) + "e-" + decimalPlace);
}

function getNumberPos(number) {
    var Pos;
    switch (number) {
        case 1:
            Pos = 0;
            break;
        case 14:
            Pos = 75;
            break;
        case 2:
            Pos = 150;
            break;
        case 13:
            Pos = 225;
            break;
        case 3:
            Pos = 300;
            break;
        case 12:
            Pos = 375;
            break;
        case 4:
            Pos = 450;
            break;
        case 0:
            Pos = 525;
            break;
        case 11:
            Pos = 600;
            break;
        case 5:
            Pos = 675;
            break;
        case 10:
            Pos = 750;
            break;
        case 6:
            Pos = 825;
            break;
        case 9:
            Pos = 900;
            break;
        case 7:
            Pos = 975;
            break;
        case 8:
            Pos = 1050;
            break;
    }
    return Pos + parseInt(resolveHash($v_secret, $v_public, $v_round).substring(0, 12), 16) % 66 + 5;
}

function getDistance(currPos, numberPos) {
    if (currPos > numberPos) return (1125 - currPos) + numberPos;
    else if (currPos < numberPos) return numberPos - currPos;
    else return 0;
}

function calculateVelocity(s) {
    return (s / 1600).round(5);
}

function getCurrentDistance(dis, t) {
    var s = dis;
    var v;
    coveredDistance = 0;
    for (i = 0; i <= t; i++) {
        v = s * calculateVelocity(speed);
        coveredDistance += v;
        s = s - v;
    }
    return s;
}

function move(Pos) {
    var xPos = -Pos;
    xPos += (($case.width()) / 2 + 3).round(0);
    $case.css("backgroundPosition", xPos + "px", "0px");
}

var animationInterval;

function animation(rolledNumPos, winner, currentPos, distance, animStart) {
    if (isRolling) {
        var elapsedTime = ((getCurrentTime() - animStart) / 10).round(0);
        distance = getCurrentDistance(distanceToCover, elapsedTime);
        currentPos = coveredDistance % 1125;
        if (distance < 18) {
            manualRoll = false;
            move(rolledNumPos);
            console.log(rolledNumPos);
            sound_done.play();
            coveredDistance = 0;
            currentPos = rolledNumPos;
            clearInterval(animationInterval);
            $pbtext.html("Winner " + winner + "!");
            updateHistory(winner);
            roundEnd(numberToColor(winner));
            setTimeout(function() {
                toggleBetting();
                $pbtext.html("Waiting for next round...");
                if (autoIncrement && !blockIncrement) {
                    $v_round++;
                    $g_round.val($v_round);
                } else if (blockIncrement) blockIncrement = false;
                isRolling = false;
                setToRollingIn();
            }, 2500);
        } else move(currentPos);
    }
}

function startRolling(numPos, rolledNum, winner) {
    if (!isRolling) {
        toggleBetting();
        isRolling = true;
        var currentPosition = 0;
        move(currentPosition);
        var distance = 9000 + getDistance(currentPosition, numPos);
        distanceToCover = distance;
        $pbtext.html("Rolling...");
        sound_rolling.play();
        var animStart = getCurrentTime();
        animationInterval = setInterval(function() {
            animation(rolledNum, winner, currentPosition, distance, animStart);
        }, 10);
    }
}

function rollingInInterval(rollStartTime) {
    var timeLeft = rollStartTime - getCurrentTime();
    if (timeLeft < 0) timeLeft = 0;
    var rollingInTime = (timeLeft / 1000).round(2);
    var rollingInText;
    if ((rollingInTime * 100).round(0) % 100 == 0) rollingInText = rollingInTime.toString() + ".00";
    else if ((rollingInTime * 100).round(0) % 10 == 0) rollingInText = rollingInTime.toString() + "0";
    else rollingInText = rollingInTime.toString();
    $pbtext.html("Rolling in " + rollingInText + "...");
    var procent = (timeLeft / countDown) * 100;
    $pb.css("width", procent + "%");
    if (manualRoll) $pb.css("width", "0%");
    if (procent == 0 || rollStartTime == 0 || manualRoll) {
        manualRoll = false;
        var winner = generator($v_secret, $v_public, $v_round);
        var rolledNumber = getNumberPos(winner);
        var numberPos = rolledNumber + 18;
        clearInterval(timerInterval);
        startRolling(numberPos, rolledNumber, winner);
    }
}

function setToRollingIn() {
    if (countDown <= 0) countDown = 1;
    var rollStartTime = getCurrentTime() + countDown;
    timerInterval = setInterval(function() {
        rollingInInterval(rollStartTime);
    }, 10);
}

function pageOnload() {
    setToRollingIn();
}
