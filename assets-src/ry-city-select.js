import $ from 'jquery';

jQuery(function ($) {
    // ry_wc_city_select_params is required to continue, ensure the object exists
    // wc_country_select_params is used for selectWoo texts. This one is added by WC
    if (typeof wc_country_select_params === 'undefined' || typeof ry_wc_city_select_params === 'undefined') {
        return false;
    }

    // Select2 Enhancement if it exists
    if ($().selectWoo) {
        const getEnhancedSelectFormatString = function () {
            return {
                'language': {
                    errorLoading: function () {
                        return wc_country_select_params.i18n_searching;
                    },
                    inputTooLong: function (args) {
                        const overChars = args.input.length - args.maximum;
                        if (overChars === 1) {
                            return wc_country_select_params.i18n_input_too_long_1;
                        }
                        return wc_country_select_params.i18n_input_too_long_n.replace('%qty%', overChars);
                    },
                    inputTooShort: function (args) {
                        const remainingChars = args.minimum - args.input.length;
                        if (remainingChars === 1) {
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

        const wc_city_select_select2 = function () {
            $('select.city_select:visible').each(function () {
                const select2Args = $.extend({
                    placeholder: $(this).attr('data-placeholder') || $(this).attr('placeholder') || '',
                    width: '100%'
                }, getEnhancedSelectFormatString());

                $(this)
                    .on('select2:select', function () {
                        $(this).trigger('focus');
                    })
                    .selectWoo(select2Args);
            });
        };

        wc_city_select_select2();

        $(document.body).on('city_to_select', function () {
            wc_city_select_select2();
        });
    }

    /* City select boxes */
    $(document.body).on('country_to_state_changing', function (e, country, $container) {
        const $statebox = $container.find('#billing_state, #shipping_state, #calc_shipping_state');
        const state = $statebox.val();
        $(document.body).trigger('state_changing', [country, state, $container]);
    });

    $(document.body).on('change', 'select.state_select, #calc_shipping_state', function () {
        const $container = $(this).closest('.form-row').parent();
        const country = $container.find('#billing_country, #shipping_country, #calc_shipping_country').val();
        const state = $(this).val();

        $(document.body).trigger('state_changing', [country, state, $container]);
    });

    $(document.body).on('state_changing', function (e, country, state, $container) {
        const $citybox = $container.find('#billing_city, #shipping_city, #calc_shipping_city');

        if (ry_wc_city_select_params.cities[country]) {
            if (state) {
                if (ry_wc_city_select_params.cities[country][state]) {
                    cityToSelect($citybox, ry_wc_city_select_params.cities[country][state]);
                } else {
                    cityToInput($citybox);
                }
            } else {
                cityToInput($citybox);
            }
        } else {
            cityToInput($citybox);
        }
    });

    $(document.body).on('change', 'select.city_select', function () {
        const $container = $(this).closest('.form-row').parent();
        const $city = $container.find('#billing_city, #shipping_city, #calc_shipping_city');
        const postcode = $city.find(':selected').data('postcode');

        if (postcode !== undefined) {
            $container.find('#billing_postcode, #shipping_postcode, #calc_shipping_postcode').val(postcode);
        } else {
            $container.find('#billing_postcode, #shipping_postcode, #calc_shipping_postcode').val('');
        }
    });

    /* Ajax replaces .cart_totals (child of .cart-collaterals) on shipping calculator */
    if ($('.cart-collaterals').length && $('#calc_shipping_state').length) {
        const calcObserver = new MutationObserver(function () {
            $('#calc_shipping_state').trigger('change');
        });
        calcObserver.observe(document.querySelector('.cart-collaterals'), {
            childList: true
        });
    }

    function cityToInput($citybox) {
        if ($citybox.is('input')) {
            $citybox.prop('disabled', false);
            return;
        }

        const inputName = $citybox.attr('name');
        const inputID = $citybox.attr('id');
        const placeholder = $citybox.attr('placeholder');
        const $newcity = $('<input type="text">');

        $newcity.prop('id', inputID)
            .prop('name', inputName)
            .prop('placeholder', placeholder)
            .addClass('input-text');

        $citybox.parent().find('.select2-container').remove();
        $citybox.replaceWith($newcity);

        $('#' + inputID).closest('.form-row').parent()
            .find('#billing_postcode, #shipping_postcode, #calc_shipping_postcode')
            .val('');
    }

    function disableCity($citybox) {
        $citybox.val('').trigger('change');
        $citybox.prop('disabled', true);
    }

    function cityToSelect($citybox, currentCities) {
        const value = $citybox.val();

        if ($citybox.is('input')) {
            const inputName = $citybox.attr('name');
            const inputID = $citybox.attr('id');
            const placeholder = $citybox.attr('placeholder');
            const $newcity = $('<select></select>');

            $newcity.prop('id', inputID)
                .prop('name', inputName)
                .data('placeholder', placeholder)
                .addClass('city_select');

            $citybox.replaceWith($newcity);
            $citybox = $('#' + inputID);
        } else {
            $citybox.prop('disabled', false);
        }

        $citybox.empty();
        for (const index in currentCities) {
            if (currentCities.hasOwnProperty(index)) {
                const $option = $('<option></option>');
                let cityName;
                if (currentCities[index] instanceof Array) {
                    cityName = currentCities[index][0];
                    $option.attr('data-postcode', currentCities[index][1]);
                } else {
                    cityName = currentCities[index];
                }
                $option.prop('value', cityName)
                    .text(cityName);
                $citybox.append($option);
            }
        }

        let $citySelected = $citybox.find('option[value="' + value + '"]');
        if ($citySelected.length) {
            $citySelected.prop('selected', true);
        } else {
            $citybox.find('option:first').prop('selected', true);
        }
        $citybox.trigger('change');

        $(document.body).trigger('city_to_select');
    }
});
