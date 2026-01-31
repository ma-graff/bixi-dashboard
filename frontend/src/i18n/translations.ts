export type Language = 'en' | 'fr';

export const translations = {
    en: {
        // Header
        title: 'Bixi Dashboard',
        subtitle: 'Montreal Real-Time BIXI Stats',
        bikes: 'Bikes',
        ebikes: 'E-Bikes',
        docks: 'Docks',
        stations: 'Stations',
        live: 'Live',
        updating: 'Updating...',
        updated: 'Updated',
        connecting: 'Connecting...',

        // Navigation
        dashboard: 'Dashboard',
        pastData: 'Past Data',

        // About
        about: 'About',
        aboutTitle: 'About Bixi Dashboard',
        aboutText: 'This dashboard provides real-time visualization of Montreal\'s Bixi bike-sharing system. Data is sourced from the official BIXI GBFS feed. Made by Matt Graff, January 2026.',
        close: 'Close',

        // Settings
        settings: 'Settings',
        settingsTitle: 'Settings',
        settingsPlaceholder: 'Settings options will be available here in a future update.',
        basemapLabel: 'Map Style',
        cyclosmDescription: 'Cycling-focused map showing bike lanes and paths',
        openfreemapDescription: 'Standard OpenStreetMap style',

        // Map Legend
        availability: 'Availability',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        empty: 'Empty',

        // CycloSM Legend
        cyclingInfrastructure: 'Cycling Infrastructure',
        cycleway: 'Bike Path',
        cycleTrack: 'Cycle Track',
        cycleLane: 'Cycle Lane',
        sharedLane: 'Shared Lane',
        bikeRoute: 'Bike Route',
        fullLegend: 'Full Legend',

        // Station Popup
        stationId: 'ID',
        classic: 'Classic',
        capacity: 'Capacity',
        installed: 'Installed',
        notInstalled: 'Not Installed',
        renting: 'Renting',
        notRenting: 'Not Renting',
        returning: 'Returning',
        noReturns: 'No Returns',
        chargingStation: 'Charging Station',
        totalBikes: 'Total Bikes',
        stationCapacity: 'Station Capacity',
        lastReported: 'Last Reported',
        unknown: 'Unknown',

        // Availability Status
        highAvailability: 'High Availability',
        moderate: 'Moderate',
        lowAvailability: 'Low Availability',

        // Loading
        loadingTitle: 'Loading Bixi Stations',
        loadingText: 'Fetching real-time data from Montreal...',

        // Error
        connectionError: 'Connection Error',
        errorText: 'Unable to fetch station data. Make sure the backend server is running on port 8000.',

        // Past Data Page
        pastDataTitle: 'Historical Data',
        comingSoon: 'Coming Soon',
        pastDataDescription: 'Historical station data and analytics will be available in a future update.',
    },
    fr: {
        // Header
        title: 'Tableau de bord BIXI',
        subtitle: 'BIXI Montréal en temps réel',
        bikes: 'Vélos',
        ebikes: 'É-Vélos',
        docks: 'Ancrages',
        stations: 'Stations',
        live: 'En direct',
        updating: 'Mise à jour en cours...',
        updated: 'Dernière mise à jour',
        connecting: 'Connexion en cours...',

        // Navigation
        dashboard: 'Tableau de bord',
        pastData: 'Données historiques',

        // About
        about: 'À propos',
        aboutTitle: 'À propos du tableau de bord BIXI',
        aboutText: 'Ce tableau de bord offre une visualisation en temps réel du système de vélopartage BIXI de Montréal. Les données proviennent du flux GBFS officiel de BIXI. Réalisé par Matt Graff, janvier 2026.',
        close: 'Fermer',

        // Settings
        settings: 'Réglages',
        settingsTitle: 'Réglages',
        settingsPlaceholder: 'Les options de réglages seront disponibles dans une prochaine mise à jour.',
        basemapLabel: 'Style de carte',
        cyclosmDescription: 'Carte axée sur le cyclisme avec pistes et voies cyclables',
        openfreemapDescription: 'Style OpenStreetMap standard',

        // Map Legend
        availability: 'Disponibilité',
        high: 'Élevée',
        medium: 'Moyenne',
        low: 'Faible',
        empty: 'Aucun vélo',

        // CycloSM Legend
        cyclingInfrastructure: 'Infrastructure cyclable',
        cycleway: 'Piste cyclable',
        cycleTrack: 'Voie cyclable',
        cycleLane: 'Bande cyclable',
        sharedLane: 'Voie partagée',
        bikeRoute: 'Itinéraire cyclable',
        fullLegend: 'Légende complète',

        // Station Popup
        stationId: 'No',
        classic: 'Classiques',
        capacity: 'Capacité',
        installed: 'En service',
        notInstalled: 'Hors service',
        renting: 'Location disponible',
        notRenting: 'Location non disponible',
        returning: 'Retours acceptés',
        noReturns: 'Retours non acceptés',
        chargingStation: 'Station de recharge',
        totalBikes: 'Total des vélos',
        stationCapacity: 'Capacité de la station',
        lastReported: 'Dernière communication',
        unknown: 'Inconnu',

        // Availability Status
        highAvailability: 'Disponibilité élevée',
        moderate: 'Disponibilité moyenne',
        lowAvailability: 'Disponibilité faible',

        // Loading
        loadingTitle: 'Chargement des stations BIXI',
        loadingText: 'Récupération des données en temps réel de Montréal...',

        // Error
        connectionError: 'Erreur de connexion',
        errorText: 'Impossible de récupérer les données des stations. Veuillez vous assurer que le serveur est en fonction.',

        // Past Data Page
        pastDataTitle: 'Données historiques',
        comingSoon: 'À venir',
        pastDataDescription: 'Les données historiques et les analyses des stations seront disponibles dans une prochaine mise à jour.',
    },
} as const;

export type TranslationKey = keyof typeof translations.en;
