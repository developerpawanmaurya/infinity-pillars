<?php
/**
 * Plugin Name:  Infinity Pillars Blocks
 * Plugin URI:   https://infinitypillars.com
 * Description:  Custom Gutenberg content blocks — Stats Row, Expert Quote, CTA, FAQ, Timeline, 3D animated GSAP blocks, and more.
 * Version:      1.1.0
 * Author:       Infinity Pillars
 * License:      GPL-2.0-or-later
 * Text Domain:  ip-blocks
 */

defined( 'ABSPATH' ) || exit;

// Register custom block category
add_filter( 'block_categories_all', function ( $categories ) {
    return array_merge(
        [ [ 'slug' => 'infinity-pillars', 'title' => 'Infinity Pillars', 'icon' => null ] ],
        $categories
    );
} );

// Enqueue the block editor script
add_action( 'enqueue_block_editor_assets', function () {
    $asset_file = file_exists( __DIR__ . '/build/index.asset.php' )
        ? include __DIR__ . '/build/index.asset.php'
        : [ 'dependencies' => [], 'version' => '1.1.0' ];

    wp_enqueue_script(
        'ip-blocks-editor',
        plugins_url( 'build/index.js', __FILE__ ),
        $asset_file['dependencies'],
        $asset_file['version'],
        true
    );
} );

// Enqueue GSAP frontend animations on public pages
add_action( 'wp_enqueue_scripts', function () {
    $asset_file = file_exists( __DIR__ . '/build/frontend.asset.php' )
        ? include __DIR__ . '/build/frontend.asset.php'
        : [ 'dependencies' => [], 'version' => '1.1.0' ];

    wp_enqueue_script(
        'ip-blocks-frontend',
        plugins_url( 'build/frontend.js', __FILE__ ),
        $asset_file['dependencies'],
        $asset_file['version'],
        true  // load in footer
    );

    // CSS is extracted by webpack — try both naming conventions
    $css_file = file_exists( __DIR__ . '/build/frontend.css' )
        ? 'build/frontend.css'
        : ( file_exists( __DIR__ . '/build/style-frontend.css' ) ? 'build/style-frontend.css' : null );

    if ( $css_file ) {
        wp_enqueue_style(
            'ip-blocks-frontend',
            plugins_url( $css_file, __FILE__ ),
            [],
            $asset_file['version']
        );
    }
} );
