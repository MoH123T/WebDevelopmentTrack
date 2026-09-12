<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/vendor/autoload.php';

function env(string $name): string
{
    $value = getenv($name);
    if ($value === false || trim($value) === '') {
        throw new RuntimeException("Missing required environment variable: {$name}");
    }
    return trim($value);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed.');
}

$name = trim((string) filter_input(INPUT_POST, 'name', FILTER_UNSAFE_RAW));
$replyTo = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$message = trim((string) filter_input(INPUT_POST, 'message', FILTER_UNSAFE_RAW));
if ($name === '' || $replyTo === false || $message === '') {
    http_response_code(422);
    exit('Please provide your name, a valid email address, and a message.');
}

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = env('MAIL_HOST');
    $mail->Port = (int) env('MAIL_PORT');
    $mail->SMTPAuth = true;
    $mail->Username = env('MAIL_USERNAME');
    $mail->Password = env('MAIL_PASSWORD');
    $mail->SMTPSecure = env('MAIL_ENCRYPTION') === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
    $mail->addAddress(env('MAIL_TO_ADDRESS'));
    $mail->addReplyTo($replyTo, $name);
    $mail->isHTML(true);
    $mail->Subject = 'New message from ' . $name;
    $safeName = htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeEmail = htmlspecialchars($replyTo, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
    $mail->Body = "<p><strong>From:</strong> {$safeName} ({$safeEmail})</p><p>{$safeMessage}</p>";
    $mail->AltBody = "From: {$name} ({$replyTo})\n\n{$message}";
    $mail->send();
    header('Location: index.html?sent=1');
    exit;
} catch (Exception | RuntimeException $exception) {
    error_log('Mail delivery failed: ' . $exception->getMessage());
    http_response_code(500);
    exit('Check The ENV File For Errors');
}
