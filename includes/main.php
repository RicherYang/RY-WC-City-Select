<?php

final class RY_WCS
{
    protected $cities;
    protected $use_geonames_org;
    protected $geonames_org_path = 'geonames-org-data';

    protected static $_instance = null;

    public static function instance()
    {
        if (null === self::$_instance) {
            self::$_instance = new self();
            self::$_instance->do_init();
        }

        return self::$_instance;
    }

    protected function do_init()
    {
        add_action('init', [$this, 'ry_init']);
    }

    public function ry_init()
    {
        load_plugin_textdomain('ry-wc-city-select', false, plugin_basename(dirname(__DIR__)) . '/languages');

        if (!defined('WC_VERSION')) {
            return;
        }

        add_action('wp_enqueue_scripts', [$this, 'load_scripts']);

        add_filter('woocommerce_billing_fields', [$this, 'billing_fields']);
        add_filter('woocommerce_shipping_fields', [$this, 'shipping_fields']);
        add_filter('woocommerce_form_field_city', [$this, 'form_field_city'], 10, 4);

        add_filter('woocommerce_states', [$this, 'load_country_states']);
        add_filter('woocommerce_rest_prepare_report_customers', [$this, 'set_state_local']);

        $this->use_geonames_org = apply_filters('ry_wcs_load_geonames_org', apply_filters('ry_wei_load_geonames_org', false));
        if ($this->use_geonames_org) {
            if (!is_dir(RY_WCS_PLUGIN_DIR . $this->geonames_org_path)) {
                if (!function_exists('unzip_file')) {
                    require_once ABSPATH . 'wp-admin/includes/file.php';
                    WP_Filesystem();
                }

                unzip_file(RY_WCS_PLUGIN_DIR . $this->geonames_org_path . '.zip', RY_WCS_PLUGIN_DIR);
            }
            if (!is_dir(RY_WCS_PLUGIN_DIR . $this->geonames_org_path)) {
                $this->use_geonames_org = false;
            }

            if ($this->use_geonames_org) {
                if (4000000 > ini_get('pcre.backtrack_limit')) {
                    ini_set('pcre.backtrack_limit', '4000000');
                }
            }
        }
    }

    public function load_scripts()
    {
        if (is_cart() || is_checkout() || is_wc_endpoint_url('edit-address')) {
            wp_enqueue_script('ry-wc-city-select', RY_WCS_PLUGIN_URL . 'style/js/city-select.js', ['jquery', 'woocommerce'], RY_WCS_VERSION, true);

            wp_localize_script('ry-wc-city-select', 'ry_wc_city_select_params', [
                'cities' => $this->get_cities(),
                'i18n_select_city_text' => esc_attr__('Select an option&hellip;', 'woocommerce'),
            ]);
        }
    }

    public function billing_fields($fields)
    {
        $fields['billing_city']['type'] = 'city';
        return $fields;
    }

    public function shipping_fields($fields)
    {
        $fields['shipping_city']['type'] = 'city';
        return $fields;
    }

    public function form_field_city($field, $key, $args, $value)
    {
        // Do we need a clear div?
        if ((!empty($args['clear']))) {
            $after = '<div class="clear"></div>';
        } else {
            $after = '';
        }

        // Required markup
        if ($args['required']) {
            $args['class'][] = 'validate-required';
            $required = ' <abbr class="required" title="' . esc_attr__('required', 'woocommerce') . '">*</abbr>';
        } else {
            $required = '';
        }

        // Custom attribute handling
        $custom_attributes = [];
        if (!empty($args['custom_attributes']) && is_array($args['custom_attributes'])) {
            foreach ($args['custom_attributes'] as $attribute => $attribute_value) {
                $custom_attributes[] = esc_attr($attribute) . '="' . esc_attr($attribute_value) . '"';
            }
        }

        // Validate classes
        if (!empty($args['validate'])) {
            foreach ($args['validate'] as $validate) {
                $args['class'][] = 'validate-' . $validate;
            }
        }

        // field p and label
        $field = '<p class="form-row ' . esc_attr(implode(' ', $args['class'])) . '" id="' . esc_attr($args['id']) . '_field">';
        if ($args['label']) {
            $field .= '<label for="' . esc_attr($args['id']) . '" class="' . esc_attr(implode(' ', $args['label_class'])) . '">' . $args['label'] . $required . '</label>';
        }

        // Get Country
        $country_key = $key == 'billing_city' ? 'billing_country' : 'shipping_country';
        $current_cc = WC()->checkout->get_value($country_key);
        $state_key = $key == 'billing_city' ? 'billing_state' : 'shipping_state';
        $current_sc = WC()->checkout->get_value($state_key);

        // Get country cities
        $cities = $this->get_cities($current_cc);
        $field .= '<span class="woocommerce-input-wrapper">';
        if (is_array($cities)) {
            $field .= '<select name="' . esc_attr($key) . '" id="' . esc_attr($args['id']) . '" class="city_select ' . esc_attr(implode(' ', $args['input_class'])) . '" ' . implode(' ', $custom_attributes) . ' placeholder="' . esc_attr($args['placeholder']) . '">
                <option value="">' . __('Select an option&hellip;', 'woocommerce') . '</option>';

            if ($current_sc && isset($cities[$current_sc])) {
                $dropdown_cities = $cities[$current_sc];
            } elseif (is_array(reset($cities))) {
                $dropdown_cities = [];
            } else {
                $dropdown_cities = $cities;
            }
            foreach ($dropdown_cities as $city_name) {
                if (is_array($city_name)) {
                    $option_attr = 'value="' . esc_attr($city_name[0]) . '"';
                    $option_attr .= ' data-postcode="' . esc_attr($city_name[1]) . '"';
                    $option_attr .= selected($value, $city_name[0], false);
                    $city_name = $city_name[0];
                } else {
                    $option_attr = 'value="' . esc_attr($city_name) . '"';
                    $option_attr .= selected($value, $city_name, false);
                }
                $field .= '<option ' . $option_attr . '>' . esc_html($city_name) . '</option>';
            }
            $field .= '</select>';
        } else {
            $field .= '<input type="text" class="input-text ' . esc_attr(implode(' ', $args['input_class'])) . '" value="' . esc_attr($value) . '" placeholder="' . esc_attr($args['placeholder']) . '" name="' . esc_attr($key) . '" id="' . esc_attr($args['id']) . '" ' . implode(' ', $custom_attributes) . ' />';
        }
        // field description and close wrapper
        if ($args['description']) {
            $field .= '<span class="description">' . esc_attr($args['description']) . '</span>';
        }
        $field .= '</span>';

        $field .= '</p>' . $after;

        return $field;
    }

    protected function i18n_files_path()
    {
        $file_path = RY_WCS_PLUGIN_DIR;
        if ($this->use_geonames_org) {
            $file_path .= $this->geonames_org_path . '/';
        }

        return $file_path;
    }

    public function load_country_states($states)
    {
        $allowed = array_merge(WC()->countries->get_allowed_countries(), WC()->countries->get_shipping_countries());
        if ($allowed) {
            $base_path = $this->i18n_files_path();
            foreach ($allowed as $code => $country) {
                if (file_exists($base_path . 'includes/states/' . $code . '.php')) {
                    $states = array_merge($states, include($base_path . 'includes/states/' . $code . '.php'));
                }
            }
        }

        return $states;
    }

    public function get_cities($cc = null)
    {
        if (empty($this->cities)) {
            $this->load_country_cities();
        }

        if (!is_null($cc)) {
            return isset($this->cities[$cc]) ? $this->cities[$cc] : false;
        } else {
            return $this->cities;
        }
    }

    public function load_country_cities()
    {
        $cities = [];
        $allowed = array_merge(WC()->countries->get_allowed_countries(), WC()->countries->get_shipping_countries());
        if ($allowed) {
            $base_path = $this->i18n_files_path();
            foreach ($allowed as $code => $country) {
                if (file_exists($base_path . 'includes/cities/' . $code . '.php')) {
                    $cities = array_merge($cities, include($base_path . 'includes/cities/' . $code . '.php'));
                }
            }
        }

        $this->cities = apply_filters('ry_wc_city_select_cities', $cities);
    }

    public function set_state_local($response)
    {
        static $states;

        if (!isset($states[$response->data['country']])) {
            $states[$response->data['country']] = WC()->countries->get_states($response->data['country']);
        }
        if (isset($states[$response->data['country']][$response->data['state']])) {
            $response->data['state'] = $states[$response->data['country']][$response->data['state']];
        }

        return $response;
    }

    public static function plugin_activation() {}

    public static function plugin_deactivation() {}
}
