<?php

$env = parse_ini_file(__DIR__ . '/.env');

$host     = $env['DB_HOST'] ?? '';
$dbname   = $env['DB_NAME'] ?? '';
$username = $env['DB_USER'] ?? '';
$password = $env['DB_PASS'] ?? '';

$conn = mysqli_connect($host, $username, $password, $dbname);

if (!$conn) {
    error_log("DB MySQLi Connection failed: " . mysqli_connect_error());
    die(json_encode(["error" => "Database connection failed: " . mysqli_connect_error()]));
}

mysqli_set_charset($conn, 'utf8mb4');

//  PDO Connection (PDO-based queries)
try {
    $dsn = "mysql:host={$host};dbname={$dbname};";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    error_log("DB PDO Connection failed: " . $e->getMessage());
}

?>