1	import { NextResponse } from 'next/server';
2	import { getServerSession } from 'next-auth/next';
3	import { authOptions } from '@/lib/auth-options';
4	import Stripe from 'stripe';
5	import { sendPaymentLink } from '@/lib/email';
6	
7	const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
8	const isDummyKey = !STRIPE_KEY || STRIPE_KEY.startsWith('sk_test_dummy');
9	
10	const stripe = new Stripe(STRIPE_KEY || 'sk_test_dummykeyforbuildonly', {
11	  apiVersion: '2024-12-18.acacia' as any,
12	});
13	
14	export async function POST(req: Request) {
15	  try {
16	    const session = await getServerSession(authOptions);
17	    if (!session || !session.user || !session.user.email) {
18	      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
19	    }
20	
21	    const { jobId, amount, clientEmail, clientName, description, jobName, sendEmail, paymentUrl } = await req.json().catch(() => ({}));
22	
23	    if (!jobId || !amount) {
24	      return NextResponse.json({ error: 'Missing required fields: jobId and amount' }, { status: 400 });
25	    }
26	
27	    const numericAmount = parseFloat(amount);
28	    if (isNaN(numericAmount) || numericAmount <= 0) {
29	      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
30	    }
31	
32	    // If we only want to trigger the email send for an already generated payment link
33	    if (sendEmail) {
34	      const emailUrl = paymentUrl;
35	      if (!emailUrl) {
36	        return NextResponse.json({ error: 'Missing paymentUrl for sending email' }, { status: 400 });
37	      }
38	
39	      const emailResult = await sendPaymentLink(
40	        clientName || 'Valued Client',
41	        clientEmail || session.user.email, // fallback to user email
42	        jobName || `Job #${jobId}`,
43	        numericAmount,
44	        emailUrl
45	      );
46	
47	      if (!emailResult.success) {
48	        return NextResponse.json({ error: 'Failed to send email via Resend' }, { status: 500 });
49	      }
50	
51	      return NextResponse.json({ success: true, message: 'Email sent successfully' });
52	    }
53	
54	    // Demo mode / Dummy key handling
55	    if (isDummyKey) {
56	      console.log('Stripe dummy key detected, returning mock payment link');
57	      return NextResponse.json({ 
58	        url: 'https://checkout.stripe.com/c/pay/test_demo_link', 
59	        paymentLinkId: 'plink_demo123',
60	        isMock: true 
61	      });
62	    }
63	
64	    // Otherwise, generate the Stripe Payment Link
65	    // 1. Create a Stripe Product for this payment link
66	    const product = await stripe.products.create({
67	      name: `Payment request: ${jobName || 'Job #' + jobId}`,
68	      description: description || `Payment request for Job ID: ${jobId}`,
69	      metadata: {
70	        jobId,
71	        clientName: clientName || '',
72	        clientEmail: clientEmail || '',
73	      },
74	    });
75	
76	    // 2. Create a Price for the product
77	    const price = await stripe.prices.create({
78	      product: product.id,
79	      unit_amount: Math.round(numericAmount * 100), // in cents
80	      currency: 'aud',
81	    });
82	
83	    // 3. Create a Stripe Payment Link using the Price
84	    const paymentLink = await stripe.paymentLinks.create({
85	      line_items: [
86	        {
87	          price: price.id,
88	          quantity: 1,
89	        },
90	      ],
91	      metadata: {
92	        jobId,
93	        clientName: clientName || '',
94	        clientEmail: clientEmail || '',
95	        description: description || '',
96	      },
97	    });
98	
99	    return NextResponse.json({ url: paymentLink.url, paymentLinkId: paymentLink.id });
100	  } catch (error: any) {
101	    console.error('Stripe Payment Link Creation Error:', error);
102	    
103	    // Fallback for key errors during development/testing
104	    if (error.message.includes('API key') || error.message.includes('No API key')) {
105	      return NextResponse.json({ 
106	        url: 'https://checkout.stripe.com/c/pay/test_demo_link', 
107	        paymentLinkId: 'plink_demo123',
108	        isMock: true 
109	      });
110	    }
111	
112	    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
113	  }
114	}
