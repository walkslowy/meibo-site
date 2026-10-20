<?php
/**
 * MEIBO contact form handler
 * Works on any PHP-enabled web server (shared hosting / VPS).
 * Receives POST from contact.html and sends an email to the sales inbox.
 */

// ---- Configuration ----
$to      = 'sales@meiboesd.com';      // <-- change to your real sales email
$subject = 'New Inquiry from MEIBO Website';
$from    = 'no-reply@meiboesd.com';   // <-- use a real domain email to improve deliverability

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

// Helper: clean input
function clean($v) {
    return htmlspecialchars(trim(stripslashes($v)), ENT_QUOTES, 'UTF-8');
}

$name    = clean($_POST['name']    ?? '');
$email   = clean($_POST['email']   ?? '');
$country = clean($_POST['country'] ?? '');
$product = clean($_POST['product'] ?? '');
$message = clean($_POST['message'] ?? '');

// Basic validation
if ($name === '' || $email === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo 'Missing or invalid required fields. Please go back and try again.';
    exit;
}

$body = "You have received a new inquiry from the MEIBO website.\n\n"
      . "Name / Company : $name\n"
      . "Email          : $email\n"
      . "Country        : $country\n"
      . "Product        : $product\n"
      . "Message        :\n$message\n";

$headers = "From: $from\r\n"
         . "Reply-To: $email\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $body, $headers);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Thank You — MEIBO</title>
<style>
  body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:0;background:#f6f9fc;color:#16242f;display:grid;place-items:center;min-height:100vh}
  .card{background:#fff;border-radius:16px;padding:48px;max-width:520px;text-align:center;box-shadow:0 20px 50px rgba(10,37,64,.12)}
  .badge{width:64px;height:64px;border-radius:50%;background:#003DA5;color:#fff;display:grid;place-items:center;font-size:32px;margin:0 auto 20px}
  h1{color:#0a2540;font-size:26px;margin:0 0 12px}
  p{color:#5b6b7b;line-height:1.6}
  a{display:inline-block;margin-top:22px;padding:12px 26px;border-radius:999px;background:#003DA5;color:#fff;text-decoration:none;font-weight:700}
</style>
</head>
<body>
  <div class="card">
    <div class="badge"><?php echo $sent ? '&#10003;' : '!'; ?></div>
    <h1><?php echo $sent ? 'Thank You!' : 'Submission Received'; ?></h1>
    <p>
      <?php
        if ($sent) {
            echo 'Your inquiry has been sent to our sales team. We will respond within 24 hours.';
        } else {
            echo 'We received your message but could not send the email automatically. '
               . 'Please contact us directly at ' . htmlspecialchars($to) . '.';
        }
      ?>
    </p>
    <a href="index.html">Back to Home</a>
  </div>
</body>
</html>
