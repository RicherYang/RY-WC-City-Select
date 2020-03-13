<?php
/*
Plugin Name: RY WC City Select
Plugin URI: https://richer.tw/ry-wc-city-select/
Description: Show a dropdown select as the cities input on WooCommerce. Auto set the postcode for selected city.
Version: 1.0.5
Author: Richer Yang
Author URI: https://richer.tw/
Text Domain: ry-woo-city-select
Domain Path: /languages
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.txt

WC requires at least: 3
WC tested up to: 4.0.0
*/

function_exists('plugin_dir_url') OR exit('No direct script access allowed');

define('RY_WCS_VERSION', '1.0.5');
define('RY_WCS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('RY_WCS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('RY_WCS_PLUGIN_BASENAME', plugin_basename(__FILE__));

require_once(RY_WCS_PLUGIN_DIR . 'class.ry-wcs.main.php');

register_activation_hook( __FILE__, ['RY_CWT', 'plugin_activation']);
register_deactivation_hook( __FILE__, ['RY_CWT', 'plugin_deactivation']);

RY_CWT::init();
