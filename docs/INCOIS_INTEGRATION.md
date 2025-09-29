# INCOIS WMS Integration

## Overview

JATAYU now integrates with the Indian National Centre for Ocean Information Services (INCOIS) ERDDAP WMS service to provide real-time government oceanographic data.

## Integration Details

### WMS Endpoint

- **Base URL**: `https://erddap.incois.gov.in/erddap/wms/`
- **Service Type**: Web Map Service (WMS) 1.3.0
- **Format**: PNG with transparency support
- **Projection**: Standard WGS84

### Available Data Layers

1. **Sea Surface Temperature (SST)**

   - Layer: `sst_daily_mean/sst`
   - Style: `boxfill/rainbow`
   - Description: Daily mean sea surface temperature from satellite data

2. **Chlorophyll-a Concentration**

   - Layer: `chlorophyll_daily/chlor_a`
   - Style: `boxfill/chlorophyll`
   - Description: Ocean chlorophyll concentration from satellite observations

3. **Significant Wave Height**

   - Layer: `wave_height_forecast/hs`
   - Style: `boxfill/precipitation`
   - Description: Forecasted significant wave height

4. **Ocean Current Speed**
   - Layer: `ocean_currents/speed`
   - Style: `boxfill/velocity`
   - Description: Ocean surface current velocity

## Features

### Real-time Integration

- ✅ Live WMS layer loading
- ✅ Opacity control (0-100%)
- ✅ Connection status monitoring
- ✅ Error handling and fallbacks

### User Controls

- **Layer Toggles**: Individual control for each INCOIS data type
- **Opacity Slider**: Adjustable transparency for overlay visualization
- **Status Indicators**: Real-time connection status with government data
- **Professional Attribution**: Proper crediting of INCOIS data sources

### Technical Implementation

- **React-Leaflet WMSTileLayer**: Native WMS support
- **Asynchronous Loading**: Non-blocking layer initialization
- **Error Resilience**: Graceful degradation when INCOIS is unavailable
- **Performance Optimized**: Efficient tile caching and rendering

## Government Data Standards

- **Official Source**: Direct integration with government oceanographic services
- **Real-time Updates**: Live data feeds from INCOIS monitoring systems
- **Professional Quality**: Government-grade data visualization
- **Compliance Ready**: Meets standards for official marine monitoring applications

## Usage in JATAYU

The INCOIS integration demonstrates:

1. **Government Partnership Capability**: Direct integration with official Indian marine data
2. **Real-time Processing**: Live oceanographic data visualization
3. **Professional Standards**: Government-quality data handling and presentation
4. **Technical Excellence**: Robust WMS integration with error handling

This positions JATAYU as a serious marine monitoring platform capable of handling official government data sources for the Smart India Hackathon presentation.
