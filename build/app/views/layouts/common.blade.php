<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
{{-- Default title --}}
@section('title')
  {{-- TODO --}}
@stop

{{-- Default description --}}
@section('description')
  {{-- TODO --}}
@stop

{{-- Default keywords --}}
@section('keywords')
  {{-- TODO --}}
@stop

        <meta charset="utf-8">
        <title>@yield('title')</title>
        <meta name="description" content="{{ preg_replace('/\s{2,}/', ' ', trim($__env->yieldContent('description'))) }}">
        <meta name="keywords" content="{{ preg_replace('/\s{2,}/', ' ', trim($__env->yieldContent('keywords'))) }}">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

        <link rel="stylesheet" href="{{ Bust::url('/css/main.css') }}">
        <script src="{{ Bust::url('/js/vendor/modernizr-2.6.2.min.js') }}"></script>
    
        @yield('head-append')
    </head>
    <body class="{{ preg_replace('/\s{2,}/', ' ', trim($__env->yieldContent('body-class'))) }}">
        <!--[if lt IE 7]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        {{-- Global navigation --}}
        @include('partials.nav')

        @yield('body')

        @include('partials.footer')


        @if (App::environment() === 'local')
           <script data-main="{{ Bust::url('/js/main.js') }}" src="{{ Bust::url('/js/vendor/require.js') }}"></script>
        @else
           <script src="{{ Bust::url('/js/main.js') }}"></script>
        @endif

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
            e=o.createElement(i);r=o.getElementsByTagName(i)[0];
            e.src='//www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
            ga('create','UA-XXXXX-X');ga('send','pageview');
        </script>
    </body>
</html>
