jQuery(function() {

	// Search and filter
	jQuery('#search').on('keypress keyup', function() {
		var k = jQuery(this).val();
		if (k.length > 1)
		{
			var qs = "#channels .channel[data-slug*='"+k+"'], #channels .channel[title*='"+k+"']";
			jQuery('#channels .channel').hide();
			jQuery(qs).show();
		}
		if (k.length == 0)
		{

			jQuery('#channels .channel').show();
		}
	});



	if (jQuery('#view-channel').length > 0)
	{
		// Check in the local storage if no programme exists then request a new one
		var slug = jQuery('#view-channel').attr('data-slug');

		var ls = getLocalStorage(slug);
		if (!ls)
		{
			jQuery.getJSON('/ajax/programme/' + jQuery('#view-channel').data('slug'), function(html) {
				setProgrammeContext(html);
				updateLocalStorage(slug, html);
			});
		}
		else
		{
			setProgrammeContext(ls);
		}
		
	}

	function setProgrammeContext(json)
	{
		jQuery('#now-playing').html(json.now);
		jQuery('#short-tvp').html(json.shortTVP);

		var divs = jQuery('div', "<aside>" + json.fullTVP + "</aside>");


		var html = '<ul class="list-group">';

		jQuery.each(divs, function(k,i ) {
			var _sclass = "";
			if (/now/.test(i.className))
			{
				_sclass = "list-group-item-success";
			}
			html += "<li class='list-group-item "+i.className + " " + _sclass +"'>" + i.innerHTML + '</li>';
		});

		html += "</ul>";

		jQuery('#full-tvp').html(html);
	}

	function updateLocalStorage(key, json)
	{
		if (!window.localStorage) return;
		var obj = {
			_date  : new Date().getHours(), // we are lazy and we'll update by hour
			_json  : json
		};

		var html = JSON.stringify(obj);
		window.localStorage.setItem(key, html);
	}

	function getLocalStorage(key)
	{
		if (!window.localStorage) return;
		var obj = JSON.parse( window.localStorage.getItem(key) );
		if (obj)
		{
			if ( obj._date == new Date().getHours() ) { // same hour ignore
				return obj._json;
			}
			
		}
		return false;
	}


	jQuery('#send-contact-form').on('submit', function(e) {
		e.preventDefault();
		var form = jQuery(this);
		var data = {
			name    : jQuery('input[name="name"]', form).val(),
			email   : jQuery('input[name="email"]', form).val(),
			message : jQuery('textarea', form).val()
		};
		
		jQuery.post('/contact', data, function(r) {
			form.fadeOut();
			form.after('<div class="alert alert-'+r._class+'">'+r.message+'</div>');
		});
	});

	
});