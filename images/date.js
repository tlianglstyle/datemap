(function ($) {
    $.datemap = function (options) {
        $.extend($.datemap, {
            startTransform: function () {
                $(opts.control.days).find("li:animated").stop(true, false);
                for (var i = 0; i <= $(opts.control.days).find("li").length; i++) {
                    var o = $(opts.control.days).find("li").eq(i);
                    var t = 0, l = 0;
                    t = opts.m + (opts.p_h + 1 + opts.m) * (parseInt((i) / opts.p_w_s));
                    l = opts.m + (opts.p_w + 1 + opts.m) * (parseInt((i + 1) % opts.p_w_s) == 0 ? (opts.p_w_s - 1) : parseInt(i % opts.p_w_s));
                    if (!opts.animate)
                        o.css({ top: t, left: l });
                    else {
                        o.a({ top: t, left: l }, 300);
                    }
                }
            },
            loadDateYear: function () {
                $(".select_year").val(year_curr);
                var html_year = "";
                for (var i = year_curr; i > year_curr - 20; i--) {
                    html_year += "<li style=\"" + (i == year_curr ? "font-size: 16px;color: #77f524;font-weight:bold;" : "") + "\">" + i + "</li>";
                }
                $(opts.control.years).find("ul:eq(0)").append(html_year);
                html_year = "";
                for (var i = year_curr - 20; i > year_curr - 40; i--) {
                    html_year += "<li>" + i + "</li>";
                }
                $(opts.control.years).find("ul:eq(1)").append(html_year);


                var index = 1;
                $(".date-year-prev").click(function () {
                    if (index == 2) {
                        index = 1;
                        $(opts.control.years).stop(true, false).a({ left: 0 }, 500);
                    }
                });
                $(".date-year-next").click(function () {
                    if (index == 1) {
                        index = 2;
                        $(opts.control.years).stop(true, false).a({ left: -280 }, 500);
                    }
                });
                $(".select_year").mousemove(function () {
                    $(opts.control.years).css("left", "0px");
                    $(".date-year-div").show(500);
                });
                $(".right-div").mousemove(function () {
                    $(".date-year-div").fadeOut(500);
                });
                $(".date-year-close").click(function () {
                    $(".date-year-div").fadeOut(500);
                    index = 1;
                });
                $(".date-year-div ul ul li").live('click', function (event) {
                    year = $(this).html();
                    $(".select_year").val(year);
                    $(".date-year-div").fadeOut(500);
                    index = 1;
                    $.datemap.loadDateDay();
                });
                $("#btn_year_prev").click(function () {
                    if (year > year_curr - 40) {
                        year = (parseInt($(".select_year").val()) - 1); $(".select_year").val(year); $.datemap.loadDateDay();
                    }
                });
                $("#btn_year_next").click(function () {
                    if (year < year_curr) {
                        year = (parseInt($(".select_year").val()) + 1); $(".select_year").val(year); $.datemap.loadDateDay();
                    }
                });
            },
            loadDateMonth: function () {
                var month_arr = ["temp", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
                $(opts.control.months).html("");
                var html_left_li = "";
                for (var i = 1; i <= 12; i++) {
                    html_left_li += "<li><a value=\"" + i + "\">" + month_arr[i] + "</a></li>";
                }
                $(opts.control.months).append(html_left_li);
                $(opts.control.months).find("li").live('click', function (event) {
                    $(this).addClass("c").siblings().removeClass("c");
                    var id = $(this).children("a").attr("value");
                    month = id;
                    day = 1;
                    $.datemap.loadDateDay();
                });
                $(opts.control.months).find("a[value='" + month + "']").parent().addClass("c").siblings().removeClass("c");
            },
            loadDateDay: function () {
                var loadDays = function (data) {
                    if (!day_isload)
                        $(opts.control.days).html("");
                    else
                        $(opts.control.days).children("li.unbind").remove();
                    var html_li = "";
                    var week = new Date(year + "/" + month + "/" + 1).getDay();
                    month_days = $.datemap.getDays(year, month);
                    if (week > 0) {
                        for (var i = 0; i < week; i++) {
                            html_li += "<li class='unbind'></li>";
                        }
                    }
                    if (!day_isload) {
                        for (var d = 1; d <= month_days; d++) {
                            var dataDay = null;
                            if (data != null) {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].day == d)
                                        dataDay = data[i].dataDay;
                                }
                            }
                            var iscurr = false, isprev = false, isnext = false;
                            if (month == month_curr && year == year_curr) {
                                if (d == day_curr - 1) isprev = true;
                                else if (d == day_curr) iscurr = true;
                                else if (d == day_curr + 1) isnext = true;
                            }
                            html_li += "<li class='bind' value='" + d + "'>";
                            html_li += "<div class=\"day_bg\"><div class=\"";
                            if (isprev) html_li += "day_prev";
                            if (iscurr) html_li += "day_curr";
                            if (isnext) html_li += "day_next";
                            html_li += "\" value=\"" + d + "\">" + d + "</div></div>";
                            if (opts.fun.tag)
                                html_li += opts.fun.tag({ year: year, month: month, day: d, dataDay: dataDay });
                            if (opts.fun.tip)
                                html_li += opts.fun.tip({ year: year, month: month, day: d, dataDay: dataDay });
                            html_li += '</li>';
                        }
                        $(opts.control.days).append(html_li);
                        $(opts.control.days).hide().fadeIn(1000);
                        day_isload = true;
                        setTimeout(function () { $.datemap.startTransform(); }, 500);
                    }
                    else {
                        $(opts.control.days).prepend(html_li);
                        for (var d = 1; d <= 31; d++) {
                            var dataDay = null;
                            if (data != null) {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].day == d)
                                        dataDay = data[i].dataDay;
                                }
                            }
                            var iscurr = false, isprev = false, isnext = false;
                            if (month == month_curr && year == year_curr) {
                                if (d == day_curr - 1) isprev = true;
                                else if (d == day_curr) iscurr = true;
                                else if (d == day_curr + 1) isnext = true;
                            }
                            html_li = "";
                            html_li += "<div class=\"day_bg\"><div class=\"";
                            if (isprev) html_li += "day_prev";
                            if (iscurr) html_li += "day_curr";
                            if (isnext) html_li += "day_next";
                            html_li += "\" value=\"" + d + "\">" + d + "</div></div>";
                            if (opts.fun.tag)
                                html_li += opts.fun.tag({ year: year, month: month, day: d, dataDay: dataDay });
                            if (d > month_days) {
                                if ($(opts.control.days).find("li").index($(opts.control.days).find("li.bind[value=" + d + "]")) >= 0)
                                    $(opts.control.days).find("li.bind[value=" + d + "]").remove();
                            }
                            else {
                                if ($(opts.control.days).find("li").index($(opts.control.days).find("li.bind[value=" + d + "]")) >= 0) {
                                    if (opts.fun.tip)
                                        html_li += opts.fun.tip({ year: year, month: month, day: d, dataDay: dataDay });
                                    $(opts.control.days).find("li.bind[value=" + d + "]").html(html_li);
                                } else {
                                    html_li = "<li class='bind' value='" + d + "' stle='left:0px;top:0px;'>" + html_li;
                                    if (opts.fun.tag)
                                        html_li += opts.fun.tag({ year: year, month: month, day: d, dataDay: dataDay });
                                    if (opts.fun.tip)
                                        html_li += opts.fun.tip({ year: year, month: month, day: d, dataDay: dataDay });
                                    $(opts.control.days).append(html_li);
                                }
                            }
                        }
                        $.datemap.startTransform();
                    }
                };
                if (opts.fun.data) {
                    var url = opts.fun.data.url({ year: year, month: month, day: day });
                    if (url.length > 0) {
                        $.ajax({
                            type: "get",
                            async: false,
                            url: url+'&callback=jsonpCallback',
                            dataType: "jsonp",
                            jsonp: "callback",
                            success: function (data) {
                                if (data) {
                                    loadDays(data);
                                }
                            }
                        });
                    }
                } else {
                    loadDays(null);
                }
            },
            getDays: function (y, m) {
                var days = 30;
                switch (parseInt(m)) {
                    case 1: days = 31; break;
                    case 2: days = ((y % 4 == 0) ? 29 : 28); break;
                    case 3: days = 31; break;
                    case 5: days = 31; break;
                    case 7: days = 31; break;
                    case 8: days = 31; break;
                    case 10: days = 31; break;
                    case 12: days = 31; break;
                }
                return days;
            }
        });
        var defaults = {
            control: { days: '#ul_day', months: '.date-month-list ul', years: '#date-year-div-ul' },
            animate: true,
            fun: {
                data: {
                    request: false,
                    url: function (data) {
                        return 'http://tliangl.com/service/api.ashx?action=GetRandomDateData&year=' + data.year + '&month=' + data.month;
                    }
                },
                tag: function () {
                    return '';
                },
                tip: function () {
                    return '';
                },
                event: function () {
                }
            },
            p_w: 99, p_h: 59, p_w_s: 7, p_h_s: 5, m: 0
        };
        var opts = $.extend(defaults, options);
        var day_isload = false;
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year_curr = year;
        var month_curr = month;
        var day_curr = day;
        var month_days = 0;
        setTimeout(function () {
            $.datemap.loadDateYear();
            $.datemap.loadDateMonth();
            $.datemap.loadDateDay();
            $.datemap.startTransform();
        }, 300);
        $(opts.control.days).find("li").live('mouseenter', function (event) {
            $(this).siblings().eq(0).addClass('other');
            if(opts.fun.tip.length>0)
			$(this).children().last().show();
        }).live('mouseleave', function (event) {
			if(opts.fun.tip.length>0)
            $(this).children().last().hide();
            $(this).css("box-shadow", "none");
            $(this).siblings().children(".day_bg").removeClass('other');
        });
        $(opts.control.days).find("li .day_bg").live('click', function (event) {
            if (opts.fun.event)
                opts.fun.event({ year: year, month: month, day: parseInt($(this).parent().attr('value')) });
        });
    };
    $.fn.extend({
        "l": function (value) { if (value == undefined) return this.css("left"); else return this.css("left", value + 'px'); },
        "t": function (value) { if (value == undefined) return this.css("top"); else return this.css("top", value + 'px'); },
        "w": function (value) { if (value == undefined) return this.width(); else return this.width(value + 'px'); },
        "h": function (value) { if (value == undefined) return this.height(); else return this.height(value + 'px'); },
        "s": function (a, b) { if (a == undefined) return this.stop(); else return this.stop(a, b); },
        "op": function (value) { if (value == undefined) return this.css("opacity"); else return this.css("opacity", value); },
        "bgPosition": function (x, y) { return this.css("background-position", x + "px" + " " + y + "px"); },
        "opy": function () { return this.css("opacity", 1); },
        "opn": function () { return this.css("opacity", 0.3); },
        "hasAttr": function (value) { if (typeof ($(this).attr(value)) == "undefined") return false; return true; },
        "visibility": function (value) { if (value == undefined) return this.css("visibility"); else return this.css("visibility", value); },
        "a": function (a, b) { if (b == undefined) return this.animate(a); else return this.animate(a, b); },
        "show_point": function () { this.css("visibility", "inherit"); },
        "hide_point": function () { this.css("visibility", "hidden "); }
    });
})(jQuery);
function jsonpCallback(data) {}