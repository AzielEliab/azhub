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
  final _tethers = <String>[];
  final _receipts = <String>[];
  String _status = 'Blank Key. Geometry without intent.';

  void _receipt(String action) {
    setState(() {
      _receipts.insert(0, '$action · ${action.hashCode.toRadixString(16)}');
    });
  }

  void _place(String slug) {
    setState(() {
      if (!_placed.contains(slug)) _placed.add(slug);
      _status = 'Placed $slug. Hub assigned no meaning.';
    });
    _receipt('place');
  }

  void _tether() {
    if (_placed.length < 2) {
      setState(() => _status = 'Tether needs two placed tiles. No auto-wire.');
      return;
    }
    final corridor = '${_placed[0]} — ${_placed[1]}';
    setState(() {
      if (!_tethers.contains(corridor)) _tethers.add(corridor);
      _status = 'Declared corridor. Co-presence is not a tether.';
    });
    _receipt('tether_declare');
  }

  void _isolate() {
    if (_placed.isEmpty) return;
    setState(() {
      _tethers.clear();
      _status = 'Isolated ${_placed.last}. Module remains complete.';
    });
    _receipt('isolate');
  }

  void _home() {
    setState(() => _status = 'Home — everblooming sigil. Blank Key.');
    _receipt('blank_key_status');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AZHub'),
        actions: [
          IconButton(onPressed: _home, icon: const Icon(Icons.home), tooltip: 'Home'),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            'Blank Key. Hub does not decide why anything matters.',
            style: TextStyle(color: kGold, fontStyle: FontStyle.italic, fontSize: 16),
          ),
          const SizedBox(height: 8),
          const Text(
            'Not AZInterface. Not AZBrowser. Not AZNet. '
            'Declared tethers only. Modules remain complete if Hub is removed.',
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final slug in ['azmail', 'azbrowser', 'peacelock', 'godlock', 'azinterface'])
                ActionChip(label: Text(slug), onPressed: () => _place(slug)),
            ],
          ),
          const SizedBox(height: 12),
          FilledButton(onPressed: _tether, child: const Text('Tether (declare)')),
          const SizedBox(height: 8),
          OutlinedButton(onPressed: _isolate, child: const Text('Isolate')),
          const SizedBox(height: 12),
          Text(_status, style: const TextStyle(color: kGold)),
          const SizedBox(height: 8),
          Text('Placed: ${_placed.join(', ')}'),
          Text('Corridors: ${_tethers.join(', ')}'),
          const SizedBox(height: 16),
          const Text('Receipts', style: TextStyle(color: kGold)),
          for (final r in _receipts.take(12))
            Card(
              margin: const EdgeInsets.only(top: 8),
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: SelectableText(r, style: const TextStyle(fontFamily: 'monospace', fontSize: 12)),
              ),
            ),
        ],
      ),
    );
  }
}
