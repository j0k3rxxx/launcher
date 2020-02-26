let updateBar = function()
{
    $('.progressbar').each(function () {
        var t = $(this);
        var dataperc = t.attr('data-perc'),
            barperc = Math.round(dataperc * 5.56);
        t.find('.bar').dequeue();
        t.find('.bar').animate({width: barperc}, dataperc * 25);

        function perc() {
            var length = t.find('.bar').css('width'),
                perc = Math.round(parseInt(length) / 5.56),
                labelpos = (parseInt(length) - 2);
            t.find('.perc').text(perc + '%');
        }

        perc();
    });
}

module.exports = {updateBar}