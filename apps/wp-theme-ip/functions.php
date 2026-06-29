<?php
defined( 'ABSPATH' ) || exit;

// ── Theme supports ────────────────────────────────────────────────────────────
add_action( 'after_setup_theme', function () {
    add_theme_support( 'editor-styles' );
    add_theme_support( 'wp-block-styles' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'html5', [ 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption' ] );
} );

// ── REST API CORS for the React SPA ──────────────────────────────────────────
// Allows infinitypillars.com to call blog.infinitypillars.com's REST API.
add_action( 'rest_api_init', function () {
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );

    add_filter( 'rest_pre_serve_request', function ( $value ) {
        $origin  = get_http_origin();
        $allowed = [
            'https://infinitypillars.com',
            'https://www.infinitypillars.com',
        ];

        if ( in_array( $origin, $allowed, true ) ) {
            header( 'Access-Control-Allow-Origin: ' . $origin );
            header( 'Access-Control-Allow-Methods: GET, OPTIONS' );
            header( 'Access-Control-Allow-Headers: Authorization, Content-Type' );
            header( 'Vary: Origin' );
        }

        return $value;
    } );
}, 15 );

// ── Remove admin toolbar on the (unused) frontend ────────────────────────────
add_filter( 'show_admin_bar', '__return_false' );
