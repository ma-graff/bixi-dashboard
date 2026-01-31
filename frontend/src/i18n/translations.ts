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
        aboutText: 'This dashboard provides real-time visualization of Montreal\'s Bixi bike-sharing system. Data is sourced from the official GBFS feed and refreshes automatically.',
        close: 'Close',

        // Map Legend
        availability: 'Availability',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        empty: 'Empty',

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
        title: 'Bixi Dashboard',
        subtitle: 'Statistiques BIXI en temps réel à Montréal',
        bikes: 'Vélos',
        ebikes: 'É-Vélos',
        docks: 'Bornes',
        stations: 'Stations',
        live: 'En direct',
        updating: 'Mise à jour...',
        updated: 'Mis à jour',
        connecting: 'Connexion...',

        // Navigation
        dashboard: 'Tableau de bord',
        pastData: 'Historique',

        // About
        about: 'À propos',
        aboutTitle: 'À propos du tableau de bord Bixi',
        aboutText: 'Ce tableau de bord offre une visualisation en temps réel du système de vélo-partage Bixi de Montréal. Les données proviennent du flux GBFS officiel et se rafraîchissent automatiquement.',
        close: 'Fermer',

        // Map Legend
        availability: 'Disponibilité',
        high: 'Élevée',
        medium: 'Moyenne',
        low: 'Faible',
        empty: 'Vide',

        // Station Popup
        stationId: 'ID',
        classic: 'Classique',
        capacity: 'Capacité',
        installed: 'Installée',
        notInstalled: 'Non installée',
        renting: 'Location active',
        notRenting: 'Pas de location',
        returning: 'Retours actifs',
        noReturns: 'Pas de retours',
        chargingStation: 'Borne de recharge',
        totalBikes: 'Total vélos',
        stationCapacity: 'Capacité station',
        lastReported: 'Dernier rapport',
        unknown: 'Inconnu',

        // Availability Status
        highAvailability: 'Haute disponibilité',
        moderate: 'Modérée',
        lowAvailability: 'Faible disponibilité',

        // Loading
        loadingTitle: 'Chargement des stations Bixi',
        loadingText: 'Récupération des données en temps réel de Montréal...',

        // Error
        connectionError: 'Erreur de connexion',
        errorText: 'Impossible de récupérer les données des stations. Assurez-vous que le serveur backend fonctionne sur le port 8000.',

        // Past Data Page
        pastDataTitle: 'Données historiques',
        comingSoon: 'Bientôt disponible',
        pastDataDescription: 'Les données historiques et les analyses des stations seront disponibles dans une prochaine mise à jour.',
    },
} as const;

export type TranslationKey = keyof typeof translations.en;
