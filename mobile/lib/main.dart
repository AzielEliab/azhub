import 'package:flutter/material.dart';

import 'theme.dart';

void main() {
  runApp(const AzHubApp());
}

class AzHubApp extends StatelessWidget {
  const AzHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AZHub',
      debugShowCheckedModeBanner: false,
      theme: buildAppTheme(),
      home: const BlankKeyPage(),
    );
  }
}

class BlankKeyPage extends StatefulWidget {
  const BlankKeyPage({super.key});

  @override
  State<BlankKeyPage> createState() => _BlankKeyPageState();
}

class _BlankKeyPageState extends State<BlankKeyPage> {
  final _placed = <String>[];
  String _status = 'Blank Key. Geometry without intent. Co-presence is inert.';

  Future<void> _place(String slug, String kind) async {
    final region = await showDialog<String>(
      context: context,
      builder: (ctx) {
        String selected = 'center';
        bool bound = false;
        return AlertDialog(
          backgroundColor: kMatteBlack,
          title: const Text('Custody of placement', style: TextStyle(color: kGold)),
          content: StatefulBuilder(
            builder: (ctx, setLocal) {
              return Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('$slug · $kind', style: const TextStyle(color: kIvory)),
                  const SizedBox(height: 8),
                  const Text('Region', style: TextStyle(color: kGold)),
                  DropdownButton<String>(
                    value: selected,
                    dropdownColor: kSurface,
                    items: const [
                      DropdownMenuItem(value: 'center', child: Text('Center')),
                      DropdownMenuItem(value: 'north', child: Text('North')),
                      DropdownMenuItem(value: 'dock', child: Text('Dock')),
                    ],
                    onChanged: (v) => setLocal(() => selected = v ?? 'center'),
                  ),
                  CheckboxListTile(
                    value: bound,
                    onChanged: (v) => setLocal(() => bound = v ?? false),
                    title: const Text('Bound (does not unlock)', style: TextStyle(color: kIvory)),
                  ),
                  const Text(
                    'Declared wiring only. Never auto-wire. Hub does not unlock.',
                    style: TextStyle(color: kGoldDim, fontSize: 12),
                  ),
                ],
              );
            },
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            TextButton(onPressed: () => Navigator.pop(ctx, selected), child: const Text('Place')),
          ],
        );
      },
    );
    if (region == null) return;
    setState(() {
      _placed.add('$slug @ $region');
      _status = 'Placed $slug in $region. Unlocked=false. Co-presence inert.';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AZHub')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            'SPACE / Blank Key. Never AZInterface.',
            style: TextStyle(color: kGold, fontStyle: FontStyle.italic, fontSize: 16),
          ),
          const SizedBox(height: 8),
          Text(_status),
          const SizedBox(height: 16),
          const Text('App modules', style: TextStyle(color: kGold)),
          Wrap(
            spacing: 8,
            children: [
              for (final slug in ['azmail', 'azbrowser', 'azos'])
                ActionChip(label: Text(slug), onPressed: () => _place(slug, 'app')),
            ],
          ),
          const SizedBox(height: 12),
          const Text('Lock modules', style: TextStyle(color: kGold)),
          Wrap(
            spacing: 8,
            children: [
              for (final slug in ['peacelock', 'godlock', 'vibelock'])
                ActionChip(label: Text(slug), onPressed: () => _place(slug, 'lock')),
            ],
          ),
          const SizedBox(height: 16),
          const Text('Placed (inert)', style: TextStyle(color: kGold)),
          for (final row in _placed)
            Card(
              margin: const EdgeInsets.only(top: 8),
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Text(row),
              ),
            ),
        ],
      ),
    );
  }
}
