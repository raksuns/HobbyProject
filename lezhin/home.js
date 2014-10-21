!function (t) {
	"use strict";
	t.lc || (t.lc = {}), lc.Home = {init: function (t) {
		$.extend(!0, this, t), this.initTopmostBanner(), this.Popular.init(), this.initWeeklyTable(), this.initSpecials(), this.initScrollHandler(), this.Search.init(), this.Notice.init()
	}, initTopmostBanner: function () {
		var t = $("#topmost-banner"), e = t.dataset("banner-id");
		t.length && store.get(e) || ($("body").dataset("topmost-banner", !0), t.show(), t.on("click", ".close", function () {
			t.fadeOut(function () {
				$(this).remove(), $("body").dataset("topmost-banner", null), store.set(e, !0)
			})
		}))
	}, initWeeklyTable: function () {
		var t = (new Date).getDay();
		$("[data-day=" + t + "]").addClass("current"), $.each(this.comics, function (e, i) {
			i.printed && lc.Home.createComic(i, {bookCover: !0}).appendTo("#printed-comic-section ul"), i.days && $.each(i.days.split("/"), function (e, a) {
				var s = lc.Home.createComic(i, {width: a == t ? 90 : 78}), n = i.completed && !i.printed ? "#completed-comic-section ul" : ".comic-list[data-day=" + a + "]";
				s.appendTo(n)
			})
		})
	}, initSpecials: function () {
		for (var t = $("#special-comic-section ul"), e = 0, i = this.specials.length; i > e; ++e) {
			var a = this.specials[e], s = this.createComic(a, {url: "/special/"});
			t.append(s)
		}
	}, initScrollHandler: function () {
		var e = $("#main-header"), i = $("body").dataset("topmost-banner") ? 70 : 0, a = !1, s = $("#weekly-day-table"), n = s.offset().top - 50, c = !1, o = $("#printed-comic-section").offset().top - 122, l = $(t);
		l.on("scroll", function () {
			var t = l.scrollTop();
			i && (i > t ? a && (e.removeClass("sticky"), a = !1) : a || (e.addClass("sticky"), a = !0)), n > t ? c && (s.removeClass("sticky"), c = !1) : t > o ? c && (s.removeClass("sticky"), c = !1) : c || (s.addClass("sticky"), c = !0)
		})
	}, setScrollHandler: function (e, i) {
		var a = !1, s = $(t);
		return s.on("scroll", function () {
			var t = s.scrollTop();
			i > t ? a && (e.removeClass("sticky"), a = !1) : a || (e.addClass("sticky"), a = !0)
		})
	}, createComic: function (t, e) {
		e = e || {};
		var i = $("<li/>");
		i.addClass("comic"), i.dataset("comic-id", t.comicId);
		var a = $("<a/>");
		a.attr("href", (e.url || "/comic/") + t.comicId);
		var s = t[e.bookCover ? "bookCover" : "thumbnail"], n = e.width || (e.bookCover ? 100 : 78), c = $("<div/>");
		if (c.addClass("comic-cover"), c.css("background-image", "url(" + s + "?width=" + n + ")"), t.adult) {
			var o = $("<em/>");
			o.addClass("adult"), c.append(o)
		}
		if (t.newly) {
			var l = $("<em/>");
			l.addClass("new"), c.append(l)
		}
		if (t.up) {
			var r = $("<em/>");
			r.addClass("up"), c.append(r)
		}
		var d = $("<p/>").html(t.title);
		return d.addClass("comic-title"), d.html(t.title), a.append(c), a.append(d), i.append(a)
	}, setRanking: function () {
		for (var t = $("#weekly-comic-list"), e = t.find(".comic-list.current").find(".comic"), i = 0; 3 > i; ++i) {
			var a = e.eq(i).addClass("ranked").find(".comic-title");
			a.html('<em class="ranking">' + (i + 1) + "위</em>" + a.html())
		}
		for (var s = t.find(".comic-list[data-day=n]").find(".comic"), i = 0; 3 > i; ++i) {
			var a = s.eq(i).addClass("ranked").find(".comic-title");
			a.html('<em class="ranking">' + (i + 1) + "위</em>" + a.html())
		}
	}}, lc.Home.Notice = {init: function () {
		this.list = $("#notice-list"), this.load()
	}, load: function () {
		var t = $.getJSON(document.location.protocol + "//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=" + encodeURIComponent("http://blog.lezhin.com/rss"));
		t.done(function (t) {
			if (200 != t.responseStatus)
				return console.error("failed to load feeds"), void 0;
			for (var e = lc.Home.Notice, i = e.list, a = t.responseData.feed.entries, s = (new Date).getTime(), n = 0, c = 0, o = a.length; o > c; ++c) {
				var l = a[c];
				if (!(l.categories.indexOf("공지사항") < 0)) {
					var r = $("<li/>");
					r.addClass("notice");
					var d = l.publishedDate;
					s - new Date(d) <= 1728e5 && r.addClass("new");
					var h = $("<a/>");
					if (h.attr({href: l.link, target: "_blank"}), h.addClass("notice-link"), h.html(l.title), r.append(h), i.append(r), ++n >= 3)
						break
				}
			}
			e.curr = i.find(".notice").eq(0).addClass("curr").css("top", 0), e.next = i.find(".notice").eq(1).addClass("next"), e.initHandler(), e.start()
		}), t.fail(function () {
			console.error("failed to load feeds")
		})
	}, initHandler: function () {
		this.list.on("mouseenter", this.stop.bind(this)), this.list.on("mouseleave", this.start.bind(this))
	}, start: function () {
		this.interval = t.setInterval(this.showNext.bind(this), 5e3)
	}, stop: function () {
		t.clearInterval(this.interval)
	}, showNext: function () {
		var t = this.next.next(".notice");
		t.length || (t = this.list.find(".notice").first()), this.prev = this.curr.removeClass("curr").animate({top: 120}).addClass("prev"), this.curr = this.next.removeClass("next").animate({top: 0}).addClass("curr"), this.next = t.css("top", 120).addClass("next").animate({top: 60})
	}}, lc.Home.Popular = {init: function () {
		this.popularList = $("#popular-comic-list"), this.curr = this.popularList.find(".comic").first(), this.prev = this.popularList.find(".comic").last(), this.next = this.curr.next(".comic"), this.curr.css("left", 135).addClass("curr"), this.prev.css("left", -405).addClass("prev"), this.next.css("left", 675).addClass("next"), $("[data-action]").on("click", function () {
			var t = $(this), e = t.dataset("action");
			"prev" == e ? lc.Home.Popular.showPrev() : "next" == e && lc.Home.Popular.showNext()
		})
	}, showNext: function () {
		var t = this.next.next(".comic");
		t.length || (t = this.popularList.find(".comic").first()), this.prev.animate({left: -945}, function () {
			$(this).removeClass("prev")
		}), this.prev = this.curr.removeClass("curr").animate({left: -405}).addClass("prev"), this.curr = this.next.removeClass("next").animate({left: 135}).addClass("curr"), this.next = t.css("left", 1080).addClass("next").animate({left: 675})
	}, showPrev: function () {
		var t = this.prev.prev(".comic");
		t.length || (t = this.popularList.find(".comic").last()), this.next.animate({left: 1080}, function () {
			$(this).removeClass("next")
		}), this.next = this.curr.removeClass("curr").animate({left: 675}).addClass("next"), this.curr = this.prev.removeClass("prev").animate({left: 135}).addClass("curr"), this.prev = t.css("left", -945).addClass("prev").animate({left: -405})
	}}, lc.Home.Search = {init: function () {
		var t = this.initData();
		$("#search").typeahead([
			{engine: Hogan, local: t.comics, name: "comics", template: '<div class="comic" style="background-image:url({{thumbnail}}?width=50)"><p class="comic-title">{{title}}</p><p class="comic-artist">{{artist}}</p></div>'},
			{engine: Hogan, local: t.artists, name: "artists", template: '<div class="comic" style="background-image:url({{thumbnail}}?width=50)"><p class="comic-title">{{title}}</p><p class="comic-artist">{{artist}}</p></div>'}
		]), $("#search").on("typeahead:selected", function (t, e) {
			location.href = "/comic/" + e.comicId
		}), this.checkPlaceholder()
	}, initData: function () {
		var t = lc.Home.comics.slice(), e = t.slice(), i = t.slice(), a = [], s = [];
		e.sort(function (t, e) {
			return t.title.localeCompare(e.title)
		}), i.sort(function (t, e) {
			return t.artistDisplayName.localeCompare(e.artistDisplayName)
		});
		for (var n = 0, c = t.length; c > n; ++n) {
			var o = e[n];
			a.push({comicId: o.comicId, artist: o.artistDisplayName, title: o.title, thumbnail: o.thumbnail, tokens: [o.title], value: o.title});
			var l = i[n];
			s.push({comicId: l.comicId, artist: l.artistDisplayName, title: l.title, thumbnail: l.thumbnail, tokens: l.artistDisplayName.split(/\s*\/\s*/), value: l.title})
		}
		return {comics: a, artists: s}
	}, checkPlaceholder: function () {
		if (!("placeholder" in document.createElement("input"))) {
			var t = $("#search"), e = $("<span/>");
			e.attr("id", "search-label"), e.html(t.attr("placeholder")), e.insertAfter(t), e.on("click", function () {
				$(this).hide(), $("#search").focus()
			}), t.on("focus", function () {
				$("#search-label").hide()
			}), t.on("blur", function () {
				this.value || $("#search-label").show()
			})
		}
	}}, lc.Countdown = {init: function () {
		this.el = $("#countdown-clock"), this.end = +new Date("2014/03/01 00:00:00"), $("#countdown-clock").flipcountdown({size: "xs", tick: this.execute.bind(this)})
	}, execute: function () {
		var t = +new Date;
		if (this.isValid(t)) {
			var e = this.end - t, i = lc.Util.pad(Math.floor(e / 36e5)), a = lc.Util.pad(Math.floor(e % 36e5 / 6e4)), s = lc.Util.pad(Math.floor(e % 6e4 / 1e3));
			return i + ":" + a + ":" + s
		}
		return "00:00:00"
	}, isValid: function (t) {
		return t = t || new Date, t < this.end
	}}, lc.Countdown.init()
}(window);
