<template>
  <AAView class="view-guide">
    <AASection title="Ladungsträger filtern">
      <p>
        Die aufgelisteten Ladungsträger beim Dashboard können nach Wunsch
        gefiltert werden. Hierzu klick man auf das Filtersymbol, welches über
        der Liste von Ladungträgern zu finden ist.
      </p>
      <vm-image src="assets/guide/FilterIcon.png" />
      <p>
        Daraufhin öffnet sich ein Fenster, dass die aktuellen Einstellung des
        Filters darstellt. Soll ein Filter hinzugefügt werden, kann man auf eine
        der Filteroptionen klicken. Dies öffnet ein Dropdown-Menü, bei dem man
        per Klick auswählen kann, welche Untergruppe angezeigt werden soll. Ist
        eine Option ausgewählt, so wird diese grün gekennzeichnet. Dies
        bedeutet, dass Ladungsträger mit dieser Eigenschaft anzeigt werden,
        falls diese Ladungsträger vorhanden sind. In der folgenden Abbildung
        sind alle möglichen Bauteiloptionen ausgewählt und deshalb werden alle
        vorhanden Ladungsräger, unabhängig vom Bauteil dargestellt.
      </p>
      <vm-image src="assets/guide/FilterOverlay.png" />
    </AASection>
    <AASection title="Ladungsträger auswählen">
      <p>
        Trotz der Filterung kann die Situation entstehen, bei dem man sich nur
        für einen Ladungsträger interessiert. Hier kann der Benutzer durch
        setzen eines Hakens einzelne Ladungsträger auswählen, die von Interesse
        sind. Nachdem die Auswahl der Ladungsträgern getroffen wurde, kann man
        via Navigationsleiste auf die Diagrammansicht wechseln. Eigenschaften
        wie Beladung, Standzeiten und Erschütterungen werden in Form von
        Liniendiagrammen dargestellt. Werden mehrere Ladungsträger ausgewählt,
        so werden die Daten der Ladungsträger farblich markiert. Sind keine
        Haken gesetzt, verhält sich das System so, als wurden alle Ladungsträger
        ausgewählt. Daraufhin wird ein Durchschnitt zwischen den Daten der
        verschiedenen Ladungsträger berechnet. Im folgenden Beispiel wurden drei
        Ladungsträger ausgewählt.
      </p>
      <vm-image src="assets/guide/CarrierSelection.png" />
      <p>Das entsprechende Beladungdiagramm sieht wie folgt aus.</p>
      <vm-image src="assets/guide/LoadDiagram.png" />
      <p>
        Zusätzlich kann die angezeigt Zeitspanne angepasst werden. Im folgenden
        Beispiel wurde der Zeitraum auf 22.06.22 - 26.06.22 eingeschränkt.
      </p>
      <vm-image src="assets/guide/LimitedLoadDiagram.png" />
      <p>
        Analog zu der Diagrammansicht, findet man unter dem Reiter "Hotspots"
        Hotspots-Diagramme, die sich auf die ausgewählten Ladungsträger
        beziehen. Sie visualisieren verschiedene Verhalten der ausgewählten
        Ladungsträger wie Bewegungsmuster, Standzeitentwicklung,
        Beladungsentwicklung und Vibrationen.
      </p>
      <vm-image src="assets/guide/CarrierMovement.png" />
      <p>
        Wählt man hier einen Zeitraum aus und klickt auf das Startsymbol, so
        werden die Bewegungen der Ladungsträger visuell abgespielt.
      </p>
    </AASection>
  </AAView>
</template>

<script lang="ts">
import AASection from '@/components/AASection.vue';
import AAView from '@/components/AAView.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({ components: { AAView, AASection } })
export default class Guide extends Vue {}
</script>

<style lang="scss" scoped>
.view-guide {
  img {
    margin: 10px 0;
    width: 100%;
    max-width: 500px;
  }
}
</style>
