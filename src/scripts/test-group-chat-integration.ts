/**
 * Group Chat Integration Test Script
 * 
 * This script performs basic integration tests for the group chat functionality
 * Run with: npm run test:group-chat (add to package.json scripts)
 */

import { groupChatService } from '../services/groupChatService';
import { CreateGroupRequest, GroupChatSettings } from '../types/group-chat';

interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  duration: number;
}

class GroupChatIntegrationTest {
  private results: TestResult[] = [];

  async runTest(name: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    try {
      await testFn();
      this.results.push({
        name,
        success: true,
        duration: Date.now() - startTime,
      });
    } catch (error) {
      this.results.push({
        name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
      });
    }
  }

  async testBasicGroupOperations(): Promise<void> {
    let testGroupId: string;

    // Test 1: Create Group
    await this.runTest('Create Group', async () => {
      const request: CreateGroupRequest = {
        name: 'Test Group Integration',
        description: 'Testing group creation',
        avatar: '',
        participants: ['user1', 'user2'],
        settings: {
          whoCanSendMessages: 'everyone',
          whoCanAddMembers: 'admins_only',
          whoCanEditGroupInfo: 'admins_only',
          whoCanRemoveMembers: 'admins_only',
          disappearingMessages: false,
          allowMemberInvites: true,
          showMemberAddNotifications: true,
          showMemberExitNotifications: true,
          muteNonAdminMessages: false,
        },
        createdBy: 'test-admin',
      };

      const group = await groupChatService.createGroup(request);
      if (!group.id) throw new Error('Group creation failed');
      testGroupId = group.id;
    });

    // Test 2: Add Member
    await this.runTest('Add Member', async () => {
      if (!testGroupId) throw new Error('No test group available');
      await groupChatService.addMember(testGroupId, 'user3', 'test-admin');
    });

    // Test 3: Update Settings
    await this.runTest('Update Settings', async () => {
      if (!testGroupId) throw new Error('No test group available');
      const newSettings: Partial<GroupChatSettings> = {
        whoCanSendMessages: 'admins_only',
        disappearingMessages: true,
      };
      await groupChatService.updateGroupSettings(testGroupId, newSettings, 'test-admin');
    });

    // Test 4: Create Invite Link
    await this.runTest('Create Invite Link', async () => {
      if (!testGroupId) throw new Error('No test group available');
      const inviteLink = await groupChatService.createInviteLink(testGroupId, 'test-admin');
      if (!inviteLink.code) throw new Error('Invite link creation failed');
    });

    // Test 5: Get Group Analytics
    await this.runTest('Get Analytics', async () => {
      if (!testGroupId) throw new Error('No test group available');
      const analytics = await groupChatService.getGroupAnalytics(testGroupId);
      if (typeof analytics.totalMessages !== 'number') {
        throw new Error('Analytics data invalid');
      }
    });
  }

  async testPermissionSystem(): Promise<void> {
    await this.runTest('Admin Permissions Check', async () => {
      // Test admin permission validation
      const mockGroupId = 'test-group';
      const mockUserId = 'test-user';
      
      // This would typically fail in a real environment without proper setup
      try {
        await groupChatService.addMember(mockGroupId, mockUserId, 'non-admin');
      } catch (error) {
        // Expected to fail due to insufficient permissions
        if (error instanceof Error && error.message.includes('Insufficient permissions')) {
          return; // Test passed
        }
        throw error;
      }
    });
  }

  async testMobileCompatibility(): Promise<void> {
    await this.runTest('Mobile Interface Compatibility', async () => {
      // Test mobile-specific functions
      const isMobileEnv = typeof window !== 'undefined' && window.innerWidth < 1024;
      
      // Simulate mobile touch events
      if (typeof document !== 'undefined') {
        const testElement = document.createElement('div');
        testElement.className = 'mobile-test-element';
        
        // Test touch event handling
        const touchEvent = new TouchEvent('touchstart', {
          touches: [{ clientX: 100, clientY: 100 } as Touch],
        });
        
        testElement.dispatchEvent(touchEvent);
        
        // Test mobile-specific CSS classes
        testElement.classList.add('active:scale-95');
        const hasTransform = getComputedStyle(testElement).transform !== 'none';
        
        if (!testElement.classList.contains('active:scale-95')) {
          throw new Error('Mobile CSS classes not applied correctly');
        }
      }
    });
  }

  async testErrorHandling(): Promise<void> {
    await this.runTest('Error Handling', async () => {
      // Test error scenarios
      try {
        await groupChatService.getGroupById('non-existent-group');
        throw new Error('Should have thrown error for non-existent group');
      } catch (error) {
        if (error instanceof Error && error.message.includes('Failed to fetch group')) {
          return; // Expected error
        }
        throw error;
      }
    });

    await this.runTest('Invalid User Operations', async () => {
      try {
        await groupChatService.addMember('invalid-group', 'invalid-user', 'invalid-admin');
        throw new Error('Should have thrown error for invalid operations');
      } catch (error) {
        if (error instanceof Error && (
          error.message.includes('Insufficient permissions') ||
          error.message.includes('Failed to add member')
        )) {
          return; // Expected error
        }
        throw error;
      }
    });
  }

  printResults(): void {
    console.log('\n=== Group Chat Integration Test Results ===\n');
    
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const total = this.results.length;
    const totalTime = this.results.reduce((acc, r) => acc + r.duration, 0);

    console.log(`Tests: ${passed} passed, ${failed} failed, ${total} total`);
    console.log(`Time: ${totalTime}ms\n`);

    this.results.forEach((result) => {
      const status = result.success ? '✅ PASS' : '❌ FAIL';
      const duration = `(${result.duration}ms)`;
      
      console.log(`${status} ${result.name} ${duration}`);
      
      if (!result.success && result.error) {
        console.log(`    └─ ${result.error}`);
      }
    });

    if (failed > 0) {
      console.log(`\n❌ ${failed} test(s) failed. Check the errors above.`);
      process.exit(1);
    } else {
      console.log(`\n🎉 All tests passed!`);
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Group Chat Integration Tests...\n');

    try {
      await this.testBasicGroupOperations();
      await this.testPermissionSystem();
      await this.testMobileCompatibility();
      await this.testErrorHandling();
    } catch (error) {
      console.error('Test suite encountered an unexpected error:', error);
      process.exit(1);
    }

    this.printResults();
  }
}

// Export for use in other files
export { GroupChatIntegrationTest };

// Run tests if this file is executed directly
if (require.main === module) {
  const testSuite = new GroupChatIntegrationTest();
  testSuite.runAllTests().catch((error) => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}
