package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/paymentintent"
)

// InitializeStripe initializes Stripe with the secret key
// This should be called from main.go after loading environment variables
func InitializeStripe(stripeKey string) {
	if stripeKey == "" {
		panic("STRIPE_SECRET_KEY environment variable is required")
	}
	stripe.Key = stripeKey
}

// CreatePaymentIntentRequest represents the request payload
type CreatePaymentIntentRequest struct {
	Amount   int64  `json:"amount" binding:"required,min=1"`
	Currency string `json:"currency" binding:"required"`
}

// CreatePaymentIntentResponse represents the response payload
type CreatePaymentIntentResponse struct {
	ClientSecret    string `json:"clientSecret"`
	PaymentIntentID string `json:"paymentIntentId"`
}

// CreatePaymentIntent handles the creation of a Stripe Payment Intent
func CreatePaymentIntent(c *gin.Context) {
	var req CreatePaymentIntentRequest

	// Bind and validate request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"message": err.Error(),
		})
		return
	}

	// Validate currency
	if req.Currency == "" {
		req.Currency = "inr" // Default to INR
	}

	// Validate amount (minimum 1 paise for INR)
	if req.Amount < 1 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid amount",
			"message": "Amount must be at least 1 paise",
		})
		return
	}

	// Create Payment Intent parameters
	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(req.Amount),
		Currency: stripe.String(req.Currency),
		// Enable automatic payment methods (includes cards, Apple Pay, Google Pay)
		AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
			Enabled: stripe.Bool(true),
		},
		// Optional: Add metadata for order tracking
		Metadata: map[string]string{
			"source": "react-native-app",
		},
	}

	// Create the Payment Intent
	pi, err := paymentintent.New(params)
	if err != nil {
		// Handle Stripe API errors
		stripeErr, ok := err.(*stripe.Error)
		if ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Stripe API error",
				"message": stripeErr.Msg,
				"code":    stripeErr.Code,
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create payment intent",
			"message": err.Error(),
		})
		return
	}

	// Return response with client secret
	c.JSON(http.StatusOK, CreatePaymentIntentResponse{
		ClientSecret:    pi.ClientSecret,
		PaymentIntentID: pi.ID,
	})
}

