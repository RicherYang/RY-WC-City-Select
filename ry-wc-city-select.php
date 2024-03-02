<?php
/*
 * Plugin Name: RY City Select for WooCommerce
 * Plugin URI: https://ry-plugin.com/ry-wc-city-select
 * Description: Show a dropdown select as the cities input on WooCommerce. Auto set the postcode for selected city.
 * Version: 2.1.0
 * Requires at least: 5.6
 * Requires PHP: 7.4
 * Author: Richer Yang
 * Author URI: https://richer.tw/
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 *
 * Text Domain: ry-wc-city-select
 * Domain Path: /languages
 *
 * WC requires at least: 6
*/

function_exists('plugin_dir_url') or exit('No direct script access allowed');

define('RY_WCS_VERSION', '2.1.0');
define('RY_WCS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('RY_WCS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('RY_WCS_PLUGIN_BASENAME', plugin_basename(__FILE__));
define('RY_WCS_PLUGIN_LANGUAGES_DIR', plugin_dir_path(__FILE__) . '/languages');

require_once(RY_WCS_PLUGIN_DIR . 'includes/main.php');

register_activation_hook(__FILE__, ['RY_WCS', 'plugin_activation']);
register_deactivation_hook(__FILE__, ['RY_WCS', 'plugin_deactivation']);

function RY_WCS()
{
    return RY_WCS::instance();
}

RY_WCS();
