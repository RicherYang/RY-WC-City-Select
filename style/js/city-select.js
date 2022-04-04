jQuery(function ($) {
    // ry_wc_city_select_params is required to continue, ensure the object exists
    // wc_country_select_params is used for selectWoo texts. This one is added by WC
    if (typeof wc_country_select_params === 'undefined' || typeof ry_wc_city_select_params === 'undefined') {
        return false;
    }

    // Select2 Enhancement if it exists
    if ($().selectWoo) {
        var getEnhancedSelectFormatString = function () {
            return {
                'language': {
                    errorLoading: function () {
                        // Workaround for https://github.com/select2/select2/issues/4355 instead of i18n_ajax_error.
                        return wc_country_select_params.i18n_searching;
                    },
                    inputTooLong: function (args) {
                        var overChars = args.input.length - args.maximum;

                        if (1 === overChars) {
                            return wc_country_select_params.i18n_input_too_long_1;
                        }
                        return wc_country_select_params.i18n_input_too_long_n.replace('%qty%', overChars);
                    },
                    inputTooShort: function (args) {
                        var remainingChars = args.minimum - args.input.length;

                        if (1 === remainingChars) {
                            return wc_country_select_params.i18n_input_too_short_1;
                        }
                        return wc_country_select_params.i18n_input_too_short_n.replace('%qty%', remainingChars);
                    },
                    loadingMore: function () {
                        return wc_country_select_params.i18n_load_more;
                    },
                    maximumSelected: function (args) {
                        if (args.maximum === 1) {
                            return wc_country_select_params.i18n_selection_too_long_1;
                        }
                        return wc_country_select_params.i18n_selection_too_long_n.replace('%qty%', args.maximum);
                    },
                    noResults: function () {
                        return wc_country_select_params.i18n_no_matches;
                    },
                    searching: function () {
                        return wc_country_select_params.i18n_searching;
                    }
                }
            };
        };

        var wc_city_select_select2 = function () {
            $('select.city_select:visible').each(function () {
                var select2_args = $.extend({
                    placeholder: $(this).attr('data-placeholder') || $(this).attr('placeholder') || '',
                    width: '100%'
                }, getEnhancedSelectFormatString());

                $(this)
                    .on('select2:select', function () {
                        $(this).focus(); // Maintain focus after select https://github.com/select2/select2/issues/4384
                    })
                    .selectWoo(select2_args);
            });
        };

        wc_city_select_select2();

        $(document.body).bind('city_to_select', function () {
            wc_city_select_select2();
        });
    }

    /* City select boxes */
    $(document.body).on('country_to_state_changing', function (e, country, $container) {
        var $statebox = $container.find('#billing_state, #shipping_state, #calc_shipping_state'),
            state = $statebox.val();
        $(document.body).trigger('state_changing', [country, state, $container]);
    });

    $(document.body).on('change', 'select.state_select, #calc_shipping_state', function () {
        var $container = $(this).closest('.form-row').parent(),
            country = $container.find('#billing_country, #shipping_country, #calc_shipping_country').val(),
            state = $(this).val();

        $(document.body).trigger('state_changing', [country, state, $container]);
    });

    $(document.body).on('state_changing', function (e, country, state, $container) {
        var $citybox = $container.find('#billing_city, #shipping_city, #calc_shipping_city');

        if (ry_wc_city_select_params.cities[country]) {
            /* if the country has no states */
            if (state) {
                if (ry_wc_city_select_params.cities[country][state]) {
                    cityToSelect($citybox, ry_wc_city_select_params.cities[country][state]);
                } else {
                    cityToInput($citybox);
                }
            } else {
                disableCity($citybox);
            }
        } else {
            cityToInput($citybox);
        }
    });

    $(document.body).on('change', 'select.city_select', function () {
        var $container = $(this).closest('.form-row').parent(),
            $city = $container.find('#billing_city, #shipping_city, #calc_shipping_city'),
            postcode = $city.find(':selected').data('postcode');

        if (postcode !== undefined) {
            $container.find('#billing_postcode, #shipping_postcode, #calc_shipping_postcode').val(postcode);
        } else {
            $container.find('#billing_postcode, #shipping_postcode, #calc_shipping_postcode').val('');
        }
    });

    /* Ajax replaces .cart_totals (child of .cart-collaterals) on shipping calculator */
    if ($('.cart-collaterals').length && $('#calc_shipping_state').length) {
        var calc_observer = new MutationObserver(function () {
            $('#calc_shipping_state').change();
        });
        calc_observer.observe(document.querySelector('.cart-collaterals'), { childList: true });
    }

    function cityToInput($citybox) {
        if ($citybox.is('input')) {
            $citybox.prop('disabled', false);
            return;
        }

        var input_name = $citybox.attr('name'),
            input_id = $citybox.attr('id'),
            placeholder = $citybox.attr('placeholder'),
            $newcity = $('<input type="text" />')
                .prop('id', input_id)
                .prop('name', input_name)
                .prop('placeholder', placeholder)
                .addClass('input-text');

        $citybox.parent().find('.select2-container').remove();
        $citybox.replaceWith($newcity);

        $('#' + input_id).closest('.form-row').parent()
            .find('#billing_postcode, #shipping_postcode, #calc_shipping_postcode')
            .val('');
    }

    function disableCity($citybox) {
        $citybox.val('').change();
        $citybox.prop('disabled', true);
    }

    function cityToSelect($citybox, current_cities) {
        var value = $citybox.val();

        if ($citybox.is('input')) {
            var input_name = $citybox.attr('name'),
                input_id = $citybox.attr('id'),
                placeholder = $citybox.attr('placeholder'),
                $newcity = $('<select></select>')
                    .prop('id', input_id)
                    .prop('name', input_name)
                    .data('placeholder', placeholder)
                    .addClass('city_select');

            $citybox.replaceWith($newcity);
            $citybox = $('#' + input_id);
        } else {
            $citybox.prop('disabled', false);
        }

        var $defaultOption = $('<option></option>')
            .attr('value', '')
            .text(ry_wc_city_select_params.i18n_select_city_text);
        $citybox.empty().append($defaultOption);

        for (var index in current_cities) {
            if (current_cities.hasOwnProperty(index)) {
                var $option = $('<option></option>');
                if (current_cities[index] instanceof Array) {
                    var cityName = current_cities[index][0];
                    $option.attr('data-postcode', current_cities[index][1]);
                } else {
                    var cityName = current_cities[index];
                }
                $option.prop('value', cityName)
                    .text(cityName);
                $citybox.append($option);
            }
        }

        if ($('option[value="' + value + '"]', $citybox).length) {
            $citybox.val(value).change();
        } else {
            $citybox.val('').change();
        }

        $(document.body).trigger('city_to_select');
    }
});
