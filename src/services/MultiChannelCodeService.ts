// SMS and Multi-Channel Code Distribution Service
// Enhanced version of WhatsApp service to support SMS and multiple delivery methods

export interface CodeDeliveryRequest {
  phoneNumber: string;
  timestamp: Date;
  requestId: string;
  status: 'pending' | 'sent' | 'failed';
  code?: string;
  method: 'whatsapp' | 'sms' | 'both';
  deliveryDetails?: {
    whatsappSent?: boolean;
    smsSent?: boolean;
    error?: string;
  };
}

class MultiChannelCodeService {
  private codeRequests: CodeDeliveryRequest[] = [];
  private adminPhoneNumber = '233540456414'; // +233540456414 (admin WhatsApp number)

  // Generate a new access code
  generateAccessCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'BECE';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Format phone number for delivery
  formatPhoneNumber(phoneNumber: string): string {
    let formatted = phoneNumber.replace(/\s+/g, '').replace(/[^\d]/g, '');
    
    // Handle Ghana numbers
    if (formatted.startsWith('0')) {
      formatted = '233' + formatted.substring(1);
    } else if (!formatted.startsWith('233')) {
      formatted = '233' + formatted;
    }
    
    return formatted;
  }

  // Send code via WhatsApp
  async sendViaWhatsApp(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank');
      }
      
      return true;
    } catch (error) {
      console.error('WhatsApp send error:', error);
      return false;
    }
  }

  // Send code via SMS
  async sendViaSMS(phoneNumber: string, message: string): Promise<boolean> {
    try {
      // For web browsers, use the SMS URI scheme
      const smsUrl = `sms:+${phoneNumber}?body=${encodeURIComponent(message)}`;
      
      if (typeof window !== 'undefined') {
        window.open(smsUrl, '_blank');
      }
      
      return true;
    } catch (error) {
      console.error('SMS send error:', error);
      return false;
    }
  }

  // Send code via multiple channels
  async sendCodeMultiChannel(
    phoneNumber: string, 
    method: 'whatsapp' | 'sms' | 'both' = 'whatsapp'
  ): Promise<CodeDeliveryRequest> {
    const requestId = `REQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const formattedNumber = this.formatPhoneNumber(phoneNumber);
    const code = this.generateAccessCode();
    
    const request: CodeDeliveryRequest = {
      phoneNumber: formattedNumber,
      timestamp: new Date(),
      requestId,
      status: 'pending',
      code,
      method,
      deliveryDetails: {
        whatsappSent: false,
        smsSent: false
      }
    };

    try {
      const message = `🎓 BECE 2026 Platform - Access Code\n\n✅ Your access code: ${code}\n\n📱 Use this code to login to the BECE 2026 Prediction Platform\n⏰ Valid for 24 hours\n\n🆘 Need help? Reply to this message!\n\n--\nBECE 2026 Prediction Platform\nAuto-generated at ${new Date().toLocaleString()}`;
      
      let success = false;

      // Send via selected method(s)
      if (method === 'whatsapp' || method === 'both') {
        const whatsappSuccess = await this.sendViaWhatsApp(formattedNumber, message);
        request.deliveryDetails!.whatsappSent = whatsappSuccess;
        success = whatsappSuccess || success;
      }

      if (method === 'sms' || method === 'both') {
        // Add delay for 'both' method to allow user to handle WhatsApp first
        if (method === 'both') {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        const smsMessage = `BECE 2026 Access Code: ${code}\n\nLogin to BECE 2026 Prediction Platform.\nValid for 24 hours.\n\nNeed help? Contact support.`;
        const smsSuccess = await this.sendViaSMS(formattedNumber, smsMessage);
        request.deliveryDetails!.smsSent = smsSuccess;
        success = smsSuccess || success;
      }
      
      request.status = success ? 'sent' : 'failed';
      this.codeRequests.push(request);
      
      // Notify admin
      this.notifyAdmin(request);
      
      return request;
    } catch (error) {
      request.status = 'failed';
      request.deliveryDetails!.error = error instanceof Error ? error.message : 'Unknown error';
      this.codeRequests.push(request);
      throw error;
    }
  }

  // Notify admin about code distribution
  private notifyAdmin(request: CodeDeliveryRequest): void {
    const methodText = request.method === 'both' ? 'WhatsApp + SMS' : 
                      request.method === 'sms' ? 'SMS' : 'WhatsApp';
    
    const statusIcon = request.status === 'sent' ? '✅' : '❌';
    const deliveryStatus = request.method === 'both' ? 
      `WhatsApp: ${request.deliveryDetails?.whatsappSent ? '✅' : '❌'}, SMS: ${request.deliveryDetails?.smsSent ? '✅' : '❌'}` :
      `${methodText}: ${request.status === 'sent' ? '✅' : '❌'}`;

    const adminMessage = `🤖 Multi-Channel Code Distribution\n\n${statusIcon} New code sent\n📱 To: ${request.phoneNumber}\n🔑 Code: ${request.code}\n📤 Method: ${methodText}\n📊 Status: ${deliveryStatus}\n⏰ Time: ${request.timestamp.toLocaleString()}\n📝 ID: ${request.requestId}\n\n--\nBECE 2026 Admin Notification`;
    
    const adminWhatsAppUrl = `https://wa.me/${this.adminPhoneNumber}?text=${encodeURIComponent(adminMessage)}`;
    
    // In a real application, this would be an API call to send notification
    console.log('Admin notification:', adminMessage);
    
    // Send admin notification via WhatsApp
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.open(adminWhatsAppUrl, '_blank');
      }, 3000); // Delay to let user interactions complete first
    }
  }

  // Get code distribution history
  getCodeHistory(): CodeDeliveryRequest[] {
    return this.codeRequests.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Get statistics
  getStatistics() {
    const total = this.codeRequests.length;
    const sent = this.codeRequests.filter(r => r.status === 'sent').length;
    const failed = this.codeRequests.filter(r => r.status === 'failed').length;
    const today = this.codeRequests.filter(r => 
      r.timestamp.toDateString() === new Date().toDateString()
    ).length;

    const whatsappCount = this.codeRequests.filter(r => 
      r.method === 'whatsapp' || r.method === 'both'
    ).length;
    const smsCount = this.codeRequests.filter(r => 
      r.method === 'sms' || r.method === 'both'
    ).length;

    return {
      total,
      sent,
      failed,
      today,
      whatsappCount,
      smsCount,
      successRate: total > 0 ? Math.round((sent / total) * 100) : 0
    };
  }

  // Send bulk codes to multiple numbers
  async sendBulkCodes(
    phoneNumbers: string[], 
    method: 'whatsapp' | 'sms' | 'both' = 'whatsapp'
  ): Promise<CodeDeliveryRequest[]> {
    const requests: CodeDeliveryRequest[] = [];
    
    for (const phoneNumber of phoneNumbers) {
      try {
        const request = await this.sendCodeMultiChannel(phoneNumber, method);
        requests.push(request);
        
        // Add delay between messages to avoid spam
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        console.error(`Failed to send code to ${phoneNumber}:`, error);
      }
    }
    
    return requests;
  }

  // Handle incoming message (simulation for auto-responder)
  handleIncomingMessage(phoneNumber: string, message: string, channel: 'whatsapp' | 'sms'): string {
    const formattedNumber = this.formatPhoneNumber(phoneNumber);
    
    // Auto-responder for code requests
    if (message.toLowerCase().includes('code') || message.toLowerCase().includes('access')) {
      this.sendCodeMultiChannel(formattedNumber, channel);
      return 'New access code generated and sent!';
    }
    
    if (message.toLowerCase().includes('help')) {
      return 'BECE 2026 Platform Help:\n- Reply "code" to get access code\n- Visit the platform for study materials\n- Contact admin for technical support';
    }
    
    return `Thank you for contacting BECE 2026 Platform! Reply "code" for access code or "help" for assistance. (Received via ${channel})`;
  }

  // Test delivery methods (for debugging)
  async testDeliveryMethods(phoneNumber: string): Promise<void> {
    console.log('Testing delivery methods...');
    
    const testMessage = 'BECE 2026 Test Message - Please ignore this test.';
    
    try {
      console.log('Testing WhatsApp...');
      await this.sendViaWhatsApp(phoneNumber, testMessage);
      
      console.log('Testing SMS...');
      await this.sendViaSMS(phoneNumber, testMessage);
      
      console.log('All delivery methods tested successfully!');
    } catch (error) {
      console.error('Delivery test failed:', error);
    }
  }
}

// Export singleton instance
export const multiChannelCodeService = new MultiChannelCodeService();

export default MultiChannelCodeService;
