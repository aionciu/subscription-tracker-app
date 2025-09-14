import { ThemedText } from '@/components/ui/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function AnimatedCard({ children, style, onPress }: { children: React.ReactNode; style?: any; onPress?: () => void }) {
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.95}
        style={style}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={style}>
      {children}
    </View>
  );
}

export default function DashboardScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const accentColor = useThemeColor({}, 'accent');
  const iconBackgroundColor = useThemeColor({}, 'iconBackground');
  const { user } = useAuth();

  console.log('DashboardScreen: Rendering dashboard for user:', user?.id || 'No user');

  const getWelcomeMessage = () => {
    if (user?.user_metadata?.full_name) {
      return `Welcome back, ${user.user_metadata.full_name}!`;
    }
    return 'Welcome to your Dashboard!';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <ThemedText type="title" style={styles.title}>
              {getWelcomeMessage()}
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Manage your subscriptions and track your spending
            </ThemedText>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <AnimatedCard style={[styles.card, { backgroundColor: cardBackgroundColor, borderColor }]}>
            <View style={styles.statsGrid}>
              <View style={styles.statRow}>
                <View style={styles.statLeft}>
                  <View style={[styles.cardIcon, { backgroundColor: iconBackgroundColor }]}>
                    <Ionicons name="wallet-outline" size={20} color={primaryColor} />
                  </View>
                  <ThemedText type="defaultSemiBold" style={[styles.cardTitle, { color: primaryColor }]}>
                    Total Subscriptions
                  </ThemedText>
                </View>
                <ThemedText style={styles.cardValue}>0</ThemedText>
              </View>
              
              <View style={styles.statRow}>
                <View style={styles.statLeft}>
                  <View style={[styles.cardIcon, { backgroundColor: iconBackgroundColor }]}>
                    <Ionicons name="cash-outline" size={20} color={secondaryColor} />
                  </View>
                  <ThemedText type="defaultSemiBold" style={[styles.cardTitle, { color: secondaryColor }]}>
                    Monthly Cost
                  </ThemedText>
                </View>
                <ThemedText style={styles.cardValue}>$0.00</ThemedText>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>
          <View style={styles.actionButtons}>
            <AnimatedCard 
              style={[styles.actionButton, { backgroundColor: cardBackgroundColor, borderColor }]}
              onPress={() => console.log('Add Subscription pressed')}
            >
              <Ionicons name="add-circle-outline" size={24} color={primaryColor} />
              <ThemedText style={styles.actionButtonText}>Add Subscription</ThemedText>
            </AnimatedCard>
            <AnimatedCard 
              style={[styles.actionButton, { backgroundColor: cardBackgroundColor, borderColor }]}
              onPress={() => console.log('View Analytics pressed')}
            >
              <Ionicons name="analytics-outline" size={24} color={accentColor} />
              <ThemedText style={styles.actionButtonText}>View Analytics</ThemedText>
            </AnimatedCard>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  welcomeContainer: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.8,
    lineHeight: 22,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  statsContainer: {
    marginBottom: 32,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsGrid: {
    gap: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  actionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
