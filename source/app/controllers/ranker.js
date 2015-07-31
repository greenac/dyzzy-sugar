'use strict';

var math = require('mathjs');

var countDiffWeight = .5;
var loneCountWeight = countDiffWeight/4;
var nullScore = .5*loneCountWeight;
var currentDate = new Date();
var secondsInDay = 1000*60*60*24;
var dateScaler = 36;

exports.getScore = function(emailData) {
    var sum = processCountDiff(emailData.sentCount, emailData.receivedCount);
    sum += emailData.ccSentCount === 0 ? nullScore : processLoneCounts(emailData.ccSentCount);
    sum += emailData.lastSentEmail ? processDates(emailData.lastSentEmail) : nullScore;
    sum += emailData.lastCCEmail ? processDates(emailData.lastCCEmail) : nullScore;
    sum += emailData.lastReceivedEmail ? processDates(emailData.lastReceivedEmail) : nullScore;

    return sum;
};

var processCountDiff = function(sent, received) {
    var total = sent + received;
    var diff = math.abs(sent - received);
    var gauss = .3*math.pow(math.e, -math.pow(diff/2, 2));
    var count = .7*math.atan(total)/math.pi;
    var score = count + gauss;
    return countDiffWeight*score;
};

var processLoneCounts = function(count) {
    var score = 2*math.atan(count)/math.pi;
    return loneCountWeight*score;
};

var processDates = function (dateString) {
    var processDate = new Date(dateString);
    var diff = math.abs(currentDate - processDate)/secondsInDay;
    var score = (2/math.pi)*(math.pi/2 - math.atan(diff/dateScaler));
    return loneCountWeight*score;
};