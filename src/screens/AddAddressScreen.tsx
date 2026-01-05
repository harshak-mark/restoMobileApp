import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

import BottomNav from '../components/BottomNav';
import { useAppDispatch } from '../store/hooks';
import { addAddress, AddressLabel } from '../store/slices/addressSlice';
import { useTheme } from '../theme/useTheme';

const LABELS: AddressLabel[] = ['Home', 'Work', 'Other'];

const AddAddressScreen = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const params = useLocalSearchParams<{ next?: string }>();
  const dispatch = useAppDispatch();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [label, setLabel] = useState<AddressLabel>('Home');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [cityQuery, setCityQuery] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (isWeb && !coords) {
      setCoords({ lat: 12.9716, lng: 77.5946 });
    }
  }, [isWeb, coords]);

  const stubCities = useMemo(
    () => [
      { name: 'Bengaluru', pins: ['560001', '560002', '560003', '560004', '560005'] },
      { name: 'Chennai', pins: ['600001', '600002', '600003', '600004'] },
      { name: 'Mumbai', pins: ['400001', '400002', '400003', '400004'] },
      { name: 'Delhi', pins: ['110001', '110002', '110003', '110004'] },
      { name: 'Hyderabad', pins: ['500001', '500002', '500003', '500004'] },
      { name: 'Nellore', pins: ['524001', '524002', '524003'] },
      { name: 'Kolkata', pins: ['700001', '700002', '700003'] },
      { name: 'Pune', pins: ['411001', '411002', '411003'] },
      { name: 'Jaipur', pins: ['302001', '302002', '302003'] },
    ],
    []
  );

  const citySuggestions = useMemo(() => {
    const q = cityQuery.trim().toLowerCase();
    if (!q) return [];
    return stubCities.filter((c) => c.name.toLowerCase().includes(q));
  }, [cityQuery, stubCities]);

  const validatePin = (cityValue: string, pin: string) => {
    const cityEntry = stubCities.find((c) => c.name.toLowerCase() === cityValue.trim().toLowerCase());
    if (!cityEntry) return true; // if city not found in stub, allow
    return cityEntry.pins.includes(pin.trim());
  };

  const handleSave = () => {
    const cityValue = city || cityQuery;
    const isValidPin = validatePin(cityValue, pinCode);
    if (!isValidPin) {
      setPinError('Enter a valid pincode for the selected city');
      return;
    }
    dispatch(
      addAddress({
        address,
        city: cityValue,
        pinCode,
        landmark,
        label,
        coords: coords || { lat: 0, lng: 0 },
      })
    );
    const next = params.next as string | undefined;
    if (next) {
      router.replace(next as any);
    } else {
      router.replace('/settings');
    }
  };

  const mapHtml = useMemo(() => {
    // NOTE: replace YOUR_GOOGLE_MAPS_API_KEY with actual key in production
    return `
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="initial-scale=1, maximum-scale=1">
          <style>html, body, #map { margin: 0; padding: 0; height: 100%; }</style>
          <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY"></script>
        </head>
        <body>
          <div id="map"></div>
          <script>
            const map = new google.maps.Map(document.getElementById('map'), {
              center: { lat: 12.9716, lng: 77.5946 },
              zoom: 12,
            });
            let marker = new google.maps.Marker({
              position: { lat: 12.9716, lng: 77.5946 },
              map,
              draggable: true,
            });
            function sendPosition(pos) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ lat: pos.lat(), lng: pos.lng() }));
            }
            marker.addListener('dragend', (e) => sendPosition(e.latLng));
            map.addListener('click', (e) => {
              marker.setPosition(e.latLng);
              sendPosition(e.latLng);
            });

            // Basic autocomplete on map click (no Places API)
            // If Places API is available, hook it here
          </script>
        </body>
      </html>
    `;
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity
          onPress={() => {
            const next = params.next as string | undefined;
            if (next) {
              router.replace(next as any);
            } else {
              router.replace('/settings');
            }
          }}
          style={styles.headerIcon}
        >
          <Ionicons name="chevron-back" size={26} color={theme.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Add Address</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView
        style={styles.formScroll}
        contentContainerStyle={styles.formWrapper}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapContainer}>
          <WebView
            originWhitelist={['*']}
            source={{ html: mapHtml }}
            onMessage={(event) => {
              try {
                const parsed = JSON.parse(event.nativeEvent.data);
                if (parsed.lat && parsed.lng) {
                  setCoords({ lat: parsed.lat, lng: parsed.lng });
                }
              } catch (e) {
                // ignore parse errors
              }
            }}
            style={styles.webview}
          />
        </View>

        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>Address</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textPrimary }]}
            value={address}
            onChangeText={setAddress}
            placeholder="Type here..."
            placeholderTextColor={theme.textMuted}
          />
        </View>

        <View style={styles.fieldRowInline}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>City</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textPrimary }]}
              value={city || cityQuery}
              onChangeText={(text) => {
                setCity('');
                setCityQuery(text);
              }}
              placeholder="Type here..."
              placeholderTextColor={theme.textMuted}
            />
            {citySuggestions.length > 0 && (
              <View style={styles.suggestionBox}>
                {citySuggestions.map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setCity(item.name);
                      setCityQuery('');
                    }}
                  >
                    <Text style={[styles.suggestionText, { color: theme.textPrimary }]}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>Pin code</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textPrimary }]}
              value={pinCode}
              onChangeText={setPinCode}
              placeholder="Type here..."
              placeholderTextColor={theme.textMuted}
              keyboardType="number-pad"
            />
            {!!pinError && <Text style={[styles.errorText, { color: theme.error }]}>{pinError}</Text>}
          </View>
        </View>

        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>Landmark</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.textPrimary }]}
            value={landmark}
            onChangeText={setLandmark}
            placeholder="Type here..."
            placeholderTextColor={theme.textMuted}
          />
        </View>

        <Text style={[styles.fieldLabel, { color: theme.textPrimary, marginTop: 4 }]}>Label as</Text>
        <View style={styles.chipRow}>
          {LABELS.map((lbl) => {
            const active = label === lbl;
            return (
              <TouchableOpacity
                key={lbl}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? theme.buttonPrimary : theme.backgroundSecondary,
                    borderColor: active ? theme.buttonPrimary : theme.divider,
                  },
                ]}
                onPress={() => setLabel(lbl)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? theme.buttonText : theme.textPrimary },
                  ]}
                >
                  {lbl}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.buttonPrimary }]} onPress={handleSave}>
          <Text style={[styles.saveButtonText, { color: theme.buttonText }]}>Save location</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav />
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  suggestionBox: {
    backgroundColor: theme.card,
    borderRadius: 8,
    marginTop: 6,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
    maxHeight: 140,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  suggestionText: {
    fontSize: 14,
    color: theme.textPrimary,
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
  },
  header: {
    height: 140,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  headerIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  formScroll: {
    flex: 1,
  },
  formWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 140,
  },
  mapContainer: {
    height: 180,
    borderRadius: 12,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  mapFallback: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#ECEFF4',
  },
  webview: {
    width: '100%',
    height: '100%',
  },
  mapText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  fieldRow: {
    marginBottom: 12,
  },
  fieldRowInline: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 98,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  footerSvgWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  hexagonContainer: {
    position: 'absolute',
    bottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    height: 72,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  navItemCenter: {
    width: 68,
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default AddAddressScreen;
