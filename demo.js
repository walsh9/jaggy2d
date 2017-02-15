window.addEventListener('load', function start() {
  console.log('hello');
  var $ = document.querySelector.bind(document);
  var plainCtx1 = $('#plain-1').getContext('2d');
  var jaggyCtx1 = Jaggy2d.jaggy($('#jaggy-1').getContext('2d'));

  plainCtx1.strokeStyle = "#ff0000";
  plainCtx1.beginPath();
  plainCtx1.moveTo(2, 2);
  plainCtx1.lineTo(4, 16);
  plainCtx1.lineTo(24, 4);
  plainCtx1.lineTo(5, 24);
  plainCtx1.lineTo(16, 2);
  plainCtx1.stroke();
  plainCtx1.strokeRect(5.5, 5.5, 4, 9);

  jaggyCtx1.strokeStyle = "#ff0000";
  jaggyCtx1.beginPath();
  jaggyCtx1.moveTo(2, 2);
  jaggyCtx1.lineTo(4, 16);
  jaggyCtx1.lineTo(24, 4);
  jaggyCtx1.lineTo(5, 24);
  jaggyCtx1.lineTo(16, 2);
  jaggyCtx1.stroke();
  jaggyCtx1.strokeRect(5.5, 5.5, 4, 9);
});