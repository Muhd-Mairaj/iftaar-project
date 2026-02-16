INSERT INTO donations (quantity, proof_url, status, created_at)
VALUES
  -- Pending donations
  (3, 'sample-receipt-01.jpeg', 'pending', NOW() - INTERVAL '1 hour'),
  (5, 'sample-receipt-02.jpeg', 'pending', NOW() - INTERVAL '2 hours'),
  (2, 'sample-receipt-03.jpeg', 'pending', NOW() - INTERVAL '3 hours'),
  (7, 'sample-receipt-04.jpeg', 'pending', NOW() - INTERVAL '4 hours'),
  (1, 'sample-receipt-05.jpeg', 'pending', NOW() - INTERVAL '5 hours'),

  -- Approved donations
  (10, 'sample-receipt-06.jpeg', 'approved', NOW() - INTERVAL '1 day'),
  (4, 'sample-receipt-07.jpeg', 'approved', NOW() - INTERVAL '1 day 2 hours'),
  (6, 'sample-receipt-08.jpeg', 'approved', NOW() - INTERVAL '2 days'),
  (8, 'sample-receipt-09.jpeg', 'approved', NOW() - INTERVAL '2 days 5 hours'),
  (3, 'sample-receipt-10.jpeg', 'approved', NOW() - INTERVAL '3 days'),
  (12, 'sample-receipt-11.jpeg', 'approved', NOW() - INTERVAL '3 days 3 hours'),
  (5, 'sample-receipt-12.jpeg', 'approved', NOW() - INTERVAL '4 days'),
  (9, 'sample-receipt-13.jpeg', 'approved', NOW() - INTERVAL '4 days 6 hours'),

  -- Rejected donations
  (2, 'sample-receipt-14.jpeg', 'rejected', NOW() - INTERVAL '1 day 4 hours'),
  (1, 'sample-receipt-15.jpeg', 'rejected', NOW() - INTERVAL '2 days 1 hour'),
  (4, 'sample-receipt-16.jpeg', 'rejected', NOW() - INTERVAL '3 days 2 hours'),

  -- More pending for pagination testing
  (6, 'sample-receipt-17.jpeg', 'pending', NOW() - INTERVAL '6 hours'),
  (3, 'sample-receipt-18.jpeg', 'pending', NOW() - INTERVAL '7 hours'),
  (11, 'sample-receipt-19.jpeg', 'pending', NOW() - INTERVAL '8 hours'),
  (2, 'sample-receipt-20.jpeg', 'pending', NOW() - INTERVAL '9 hours'),
  (7, 'sample-receipt-21.jpeg', 'approved', NOW() - INTERVAL '5 days'),
  (4, 'sample-receipt-22.jpeg', 'approved', NOW() - INTERVAL '5 days 4 hours'),
  (8, 'sample-receipt-23.jpeg', 'pending', NOW() - INTERVAL '10 hours'),
  (5, 'sample-receipt-24.jpeg', 'rejected', NOW() - INTERVAL '4 days 1 hour'),
  (15, 'sample-receipt-25.jpeg', 'approved', NOW() - INTERVAL '6 days');