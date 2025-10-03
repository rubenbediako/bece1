// WhatsApp Code Distribution Service
// This simulates automatic code generation and distribution via WhatsApp

export interface CodeRequest {
  phoneNumber: string;
  timestamp: Date;
  requestId: string;
  status: 'pending' | 'sent' | 'failed';
  code?: string;
}

export interface CodeStats {
  total: number;
  sent: number;
  failed: number;
  today: number;
  successRate: number;
  lastGenerated?: Date;
}

class WhatsAppCodeService {
  private codeRequests: CodeRequest[] = [];
  private adminPhoneNumber = '233540456414'; // +233540456414 (admin WhatsApp number)
  private targetUserNumber = '233540456414'; // The specific user we're generating codes for

  // Generate a new access code
  generateAccessCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'BECE';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Format phone number for WhatsApp
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

  // Quick send code to the target user (0540456414)
  sendCodeToTargetUser(): CodeRequest {
    return this.sendCodeAutomatically('0540456414');
  }

  // Send code automatically via WhatsApp with enhanced messaging
  sendCodeAutomatically(phoneNumber: string): CodeRequest {
    const requestId = `REQ_${Date.now().toString()}_${Math.random().toString(36).substring(2, 11)}`;
    const formattedNumber = this.formatPhoneNumber(phoneNumber);
    const code = this.generateAccessCode();
    
    const request: CodeRequest = {
      phoneNumber: formattedNumber,
      timestamp: new Date(),
      requestId,
      status: 'pending',
      code
    };

    try {
      // Enhanced message for target user
      const isTargetUser = formattedNumber === this.targetUserNumber;
      const message = isTargetUser 
        ? `🎓 BECE 2026 Platform - Personal Access Code\n\n🔑 Your exclusive access code: ${code}\n\n📚 Welcome to the BECE 2026 Prediction Platform!\n⭐ This code gives you access to:\n  • Exam predictions\n  • Study materials\n  • Practice questions\n  • Progress tracking\n\n⏰ Valid for 24 hours\n💬 Need help? Reply to this message!\n\n--\nBECE 2026 Prediction Platform\nGenerated: ${new Date().toLocaleString()}`
        : `🎓 BECE 2026 Platform - Access Code\n\n✅ Your new access code: ${code}\n\n📱 Use this code to login to the BECE 2026 Prediction Platform\n⏰ Valid for 24 hours\n\n🆘 Need help? Reply to this message!\n\n--\nBECE 2026 Prediction Platform\nAuto-generated at ${new Date().toLocaleString()}`;
      
      const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp (in a real app, this would be an API call)
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank');
      }
      
      request.status = 'sent';
      this.codeRequests.push(request);
      
      // Notify admin if it's for the target user
      if (isTargetUser) {
        this.notifyAdminTargetUser(request);
      } else {
        this.notifyAdmin(request);
      }
      
      return request;
    } catch (error) {
      request.status = 'failed';
      this.codeRequests.push(request);
      throw error;
    }
  }

  // Enhanced admin notification for target user
  private notifyAdminTargetUser(request: CodeRequest): void {
    const adminMessage = `🎯 TARGET USER CODE GENERATED\n\n👤 Code sent to: 0540456414\n🔑 Access Code: ${request.code ?? 'N/A'}\n⏰ Generated: ${request.timestamp.toLocaleString()}\n📝 Request ID: ${request.requestId}\n\n🎓 This is for your target BECE 2026 student.\n💼 Admin notification from code generator.\n\n--\nBECE 2026 Admin Dashboard`;
    
    const adminWhatsAppUrl = `https://wa.me/${this.adminPhoneNumber}?text=${encodeURIComponent(adminMessage)}`;
    
    console.log('Target user notification:', adminMessage);
    
    // Optional: Open admin notification
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        if (window.confirm('📱 Send admin notification about target user code?')) {
          window.open(adminWhatsAppUrl, '_blank');
        }
      }, 1000);
    }
  }

  // Notify admin about code distribution
  private notifyAdmin(request: CodeRequest): void {
    const adminMessage = `🤖 Auto Code Distribution\n\n📊 New code sent to: ${request.phoneNumber}\n🔑 Code: ${request.code ?? 'N/A'}\n⏰ Time: ${request.timestamp.toLocaleString()}\n📝 Request ID: ${request.requestId}\n\n--\nBECE 2026 Admin Notification`;
    
    const adminWhatsAppUrl = `https://wa.me/${this.adminPhoneNumber}?text=${encodeURIComponent(adminMessage)}`;
    
    console.log('Admin notification:', adminMessage);
    
    // Optional: Open admin notification
    if (typeof window !== 'undefined' && Math.random() > 0.7) {
      window.open(adminWhatsAppUrl, '_blank');
    }
  }

  // Get code distribution history
  getCodeHistory(): CodeRequest[] {
    return this.codeRequests.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Get enhanced statistics
  getStatistics(): CodeStats {
    const total = this.codeRequests.length;
    const sent = this.codeRequests.filter(r => r.status === 'sent').length;
    const failed = this.codeRequests.filter(r => r.status === 'failed').length;
    const today = this.codeRequests.filter(r => 
      r.timestamp.toDateString() === new Date().toDateString()
    ).length;
    
    const lastRequest = this.codeRequests.length > 0 
      ? this.codeRequests.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]
      : null;

    return {
      total,
      sent,
      failed,
      today,
      successRate: total > 0 ? Math.round((sent / total) * 100) : 0,
      lastGenerated: lastRequest?.timestamp
    };
  }

  // Send bulk codes to multiple numbers
  async sendBulkCodes(phoneNumbers: string[]): Promise<CodeRequest[]> {
    const requests: CodeRequest[] = [];
    
    for (const phoneNumber of phoneNumbers) {
      try {
        const request = this.sendCodeAutomatically(phoneNumber);
        requests.push(request);
        
        // Add delay between messages to avoid spam
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to send code to ${phoneNumber}:`, error);
      }
    }
    
    return requests;
  }

  // Get codes for target user specifically
  getTargetUserCodes(): CodeRequest[] {
    return this.codeRequests
      .filter(r => r.phoneNumber === this.targetUserNumber)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Auto-responder with enhanced logic
  handleIncomingMessage(phoneNumber: string, message: string): string {
    const formattedNumber = this.formatPhoneNumber(phoneNumber);
    const isTargetUser = formattedNumber === this.targetUserNumber;
    
    // Auto-responder for code requests
    if (message.toLowerCase().includes('code') || message.toLowerCase().includes('access')) {
      void this.sendCodeAutomatically(phoneNumber);
      
      if (isTargetUser) {
        return '🎓 New access code generated and sent! You should receive it shortly. This is your personalized BECE 2026 Platform access.';
      }
      return 'New access code generated and sent!';
    }
    
    if (message.toLowerCase().includes('help')) {
      return isTargetUser 
        ? '🎓 BECE 2026 Platform Help (VIP):\n- Reply "code" to get your access code\n- Visit the platform for personalized study materials\n- Direct admin support available'
        : 'BECE 2026 Platform Help:\n- Reply "code" to get access code\n- Visit the platform for study materials\n- Contact admin for technical support';
    }
    
    const greeting = isTargetUser 
      ? 'Welcome to BECE 2026 Platform! You have VIP access. Reply "code" for your access code or "help" for assistance.'
      : 'Thank you for contacting BECE 2026 Platform! Reply "code" for access code or "help" for assistance.';
    
    return greeting;
  }

  // Reset/clear history (admin function)
  clearHistory(): void {
    this.codeRequests = [];
  }

  // Export data for admin review
  exportData(): string {
    return JSON.stringify({
      requests: this.codeRequests,
      stats: this.getStatistics(),
      exportDate: new Date().toISOString()
    }, null, 2);
  }
}

// Export singleton instance
export const whatsAppCodeService = new WhatsAppCodeService();

export default WhatsAppCodeService;
